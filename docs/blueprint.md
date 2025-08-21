# **App Name**: VoteChain UI

## Core Features:

- Create Election: Enables administrators to create new elections with a title and a list of candidates. The system assigns unique IDs to each election and candidate, displayed upon creation.
- Add Voter: Allows administrators to add voters to the system by registering their names. Each voter receives a unique ID upon registration, necessary for casting votes.
- List Elections: Provides a comprehensive list of all elections, showing their titles, status (active/closed), and the list of candidates with their respective IDs.
- Cast Vote: Enables eligible voters to cast their votes by providing their voter ID, the election ID, and the candidate ID. Successful votes are recorded on the blockchain.
- Close Election: Allows administrators to close active elections, preventing further voting. Only administrators can perform this.
- Tally Results: Generates a report of election results. Results will show the candidate name, their number of votes, and the total number of votes for each election.
- Verify Blockchain Integrity: Allows admins to manually check the integrity of the blockchain's audit log. This is acomplished via an on-demand 'verify chain' button.

## Style Guidelines:

- Primary color: HSL(200, 100%, 50%) - Sky Blue (#00BFFF). This color evokes trust, stability, and clarity, aligning with the secure nature of a blockchain-based voting system.
- Background color: HSL(200, 20%, 15%) - Dark Navy (#172633). Offers a clean, professional, and modern interface, with a comfortable contrast that allows the primary color to stand out without being overpowering.
- Accent color: HSL(170, 70%, 45%) - Sea Green (#2AC7AD).  This color suggests growth, security, and reliability.  It provides sufficient saturation to make it stand apart, signaling important interactive elements.
- Body font: 'Inter', a grotesque-style sans-serif font, to ensure readability and a modern look.
- Headline font: 'Space Grotesk', a sans-serif font, to create a modern computerized look.
- Use minimalist icons for actions like 'vote,' 'add,' and 'verify' to ensure clarity. Consider icons to denote active vs. closed status.
- Use clear, sectioned layouts with cards for each action to organize functionality, improving user experience.