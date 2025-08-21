import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { dataclass } from '@/lib/dataclasses';

const DB_FILE = path.join(process.cwd(), 'chain_db.json');

// --- Data Structures ---

export class Block extends dataclass<{
  index: number;
  timestamp: number;
  vote_hash: string;
  previous_hash: string;
  nonce: number;
}>() {
  compute_hash(): string {
    const content = `${this.index}|${this.timestamp}|${this.vote_hash}|${this.previous_hash}|${this.nonce}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

export class Blockchain {
  chain: Block[];
  static POF_PREFIX = '0000';

  constructor({ chain }: { chain: Block[] }) {
    this.chain = chain;
  }

  genesis() {
    if (this.chain && this.chain.length > 0) {
      return;
    }
    let genesis_block = new Block({
      index: 0,
      timestamp: Math.floor(Date.now() / 1000),
      vote_hash: 'GENESIS',
      previous_hash: '0'.repeat(64),
      nonce: 0,
    });

    while (true) {
      if (genesis_block.compute_hash().startsWith(Blockchain.POF_PREFIX)) {
        break;
      }
      genesis_block = genesis_block.copy({ nonce: genesis_block.nonce + 1 });
    }
    this.chain = [genesis_block];
  }

  last_hash(): string {
    if (!this.chain || this.chain.length === 0) {
      return '0'.repeat(64);
    }
    return this.chain[this.chain.length - 1].compute_hash();
  }

  add_block(vote_hash: string): Block {
    const idx = this.chain.length;
    let block = new Block({
      index: idx,
      timestamp: Math.floor(Date.now() / 1000),
      vote_hash,
      previous_hash: this.last_hash(),
      nonce: 0,
    });

    while (true) {
      const h = block.compute_hash();
      if (h.startsWith(Blockchain.POF_PREFIX)) {
        break;
      }
      block = block.copy({ nonce: block.nonce + 1 });
    }
    this.chain.push(block);
    return block;
  }

  verify(): [boolean, string | null] {
    if (!this.chain || this.chain.length === 0) {
      return [false, 'Empty chain'];
    }
    for (let i = 0; i < this.chain.length; i++) {
      const blk = this.chain[i];
      const h = blk.compute_hash();
      if (!h.startsWith(Blockchain.POF_PREFIX)) {
        return [false, `PoW invalid at index ${i}`];
      }
      if (i === 0) {
        if (blk.previous_hash !== '0'.repeat(64) || blk.vote_hash !== 'GENESIS') {
          return [false, `Genesis invalid at index ${i}`];
        }
      } else {
        const prev_h = this.chain[i - 1].compute_hash();
        if (blk.previous_hash !== prev_h) {
          return [false, `Broken link at index ${i}`];
        }
      }
    }
    return [true, null];
  }
}

export type Candidate = { id: string; name: string };
export type Election = { election_id: string; title: string; candidates: Candidate[]; active: boolean };
export type User = { user_id: string; name: string; role: 'admin' | 'voter'; voted: Record<string, boolean> };
export type VotePayload = { election_id: string; candidate_id: string; salt: string };

type StoreData = {
    users: Record<string, User>;
    elections: Record<string, Omit<Election, 'election_id'>>;
    chain: any[]; // Raw block data
    payloads: VotePayload[];
}

class Store {
  users: Record<string, User> = {};
  elections: Record<string, Omit<Election, 'election_id'>> = {};
  ledger: Blockchain = new Blockchain({ chain: [] });
  payloads: VotePayload[] = [];

  constructor(data?: Partial<Store>) {
      if (data) Object.assign(this, data);
  }

  private static to_json(store: Store): StoreData {
    return {
      users: store.users,
      elections: store.elections,
      chain: store.ledger.chain.map(b => b.toObject()),
      payloads: store.payloads,
    };
  }

  private static from_json(obj: StoreData): Store {
    const s = new Store();
    s.users = obj.users || {};
    s.elections = obj.elections || {};
    s.ledger.chain = (obj.chain || []).map(b => new Block(b));
    s.payloads = obj.payloads || [];
    return s;
  }

  static async save(store: Store) {
    await fs.writeFile(DB_FILE, JSON.stringify(Store.to_json(store), null, 2));
  }

  static async load(): Promise<Store> {
    try {
      await fs.access(DB_FILE);
      const fileContent = await fs.readFile(DB_FILE, 'utf-8');
      const data = JSON.parse(fileContent);
      return Store.from_json(data);
    } catch (error) {
      console.log("No DB file found or error reading, creating a new one.");
      const s = new Store();
      s.ledger.genesis();
      
      const admin_id = crypto.randomUUID();
      s.users[admin_id] = { user_id: admin_id, name: 'Admin', role: 'admin', voted: {} };
      
      await Store.save(s);
      return s;
    }
  }
}


// --- Core Functions ---

export async function createElection(title: string, candidateNames: string[]): Promise<Election> {
  const store = await Store.load();
  const eid = crypto.randomUUID();
  const candidates = candidateNames.map(name => ({ id: crypto.randomUUID(), name }));
  
  store.elections[eid] = { title, candidates, active: true };
  await Store.save(store);
  
  return { election_id: eid, title, candidates, active: true };
}

export async function listElections(): Promise<Election[]> {
  const store = await Store.load();
  return Object.entries(store.elections).map(([eid, e]) => ({
    election_id: eid,
    ...e
  }));
}

export async function closeElection(electionId: string): Promise<{ election_id: string; active: boolean }> {
  const store = await Store.load();
  if (!store.elections[electionId]) {
    throw new Error('No such election');
  }
  store.elections[electionId].active = false;
  await Store.save(store);
  return { election_id: electionId, active: false };
}

export async function addVoter(name: string): Promise<{ voter_id: string; name: string }> {
  const store = await Store.load();
  const vid = crypto.randomUUID();
  store.users[vid] = { user_id: vid, name, role: 'voter', voted: {} };
  await Store.save(store);
  return { voter_id: vid, name };
}

function getCandidate(store: Store, electionId: string, candidateId: string): Candidate | undefined {
    const election = store.elections[electionId];
    if (!election) return undefined;
    return election.candidates.find(c => c.id === candidateId);
}


export async function castVote(voterId: string, electionId: string, candidateId: string): Promise<{ vote_hash: string; block_index: number; block_hash: string; timestamp: number; }> {
  const store = await Store.load();
  const voter = store.users[voterId];
  if (!voter || voter.role !== 'voter') {
    throw new Error('Invalid voter');
  }

  const election = store.elections[electionId];
  if (!election || !election.active) {
    throw new Error('Invalid or inactive election');
  }

  if (voter.voted[electionId]) {
    throw new Error('Voter already voted in this election');
  }
  
  if (!getCandidate(store, electionId, candidateId)) {
    throw new Error('Invalid candidate');
  }

  const payload: VotePayload = {
    election_id: electionId,
    candidate_id: candidateId,
    salt: crypto.randomBytes(16).toString('hex'),
  };
  const payloadJson = JSON.stringify(payload, Object.keys(payload).sort());
  const vote_hash = crypto.createHash('sha256').update(payloadJson).digest('hex');

  const block = store.ledger.add_block(vote_hash);
  store.payloads.push(payload);
  voter.voted[electionId] = true;
  await Store.save(store);

  return {
    vote_hash,
    block_index: block.index,
    block_hash: block.compute_hash(),
    timestamp: block.timestamp,
  };
}

export type TallyResult = {
  election_id: string;
  title: string;
  results: Array<{ candidate_id: string; name: string; votes: number }>;
  total: number;
}

export async function tally(electionId: string): Promise<TallyResult> {
  const store = await Store.load();
  const e = store.elections[electionId];
  if (!e) {
    throw new Error('No such election');
  }
  const counts: Record<string, number> = Object.fromEntries(e.candidates.map(c => [c.id, 0]));

  for (const p of store.payloads) {
    if (p.election_id === electionId && p.candidate_id in counts) {
      counts[p.candidate_id]++;
    }
  }

  let total = 0;
  const by_name = e.candidates.map(c => {
    const n = counts[c.id];
    total += n;
    return { candidate_id: c.id, name: c.name, votes: n };
  });

  return { election_id: electionId, title: e.title, results: by_name, total };
}

export async function verifyChain(): Promise<{ ok: boolean; message: string }> {
  const store = await Store.load();
  const [ok, msg] = store.ledger.verify();
  return { ok, message: msg || 'Chain OK' };
}
