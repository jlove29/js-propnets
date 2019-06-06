# js-propnets  
propnets for ggp implemented in js

JS propnets are build on top of the existing implementation of GDL grounding in JavaScript. The current grounding code cannot always complete in reasonable time, so some measures are included to run a player that utilizes the regular game description (they could be more robust). However, sometimes node’s space limits are tested by grounding - this is still a problem but can usually be avoided by manually overriding those limits with  
`node --max-old-space-size=8192 with_propnets.js`

Necessary files  
- loader.js (this is the same as the loader.js file of the grounding implementation)
- epilog.js (contains methods from both the grounded epilog.js file and the regular epilog.js file)
- with_propnets.js (implements propnets and player)

There are four main components of the propnet implementation: the propnet and associated data structures, for building the propnet; methods for marking the propnet; methods for traversing the propnet; and the recreations of GGP functions that utilize the propnet. Currently, the implementation uses backwards propagation to read the propnet.

`PropNet` data structure  
Uses the grounded game description (global) and traverses it to construct a map from lines of GDL to associated `Propositions`, as well as some other maps and sets for convenience. Each `Proposition` is connected via a series of other `Components` (logic gates); all components of the propnet have an associated value (true/false), as well as sets of inputs and outputs (both containing other `Components`). Propositions can be one of five subclasses:
- `InitProposition` (start with `value = true`)
- `BaseProposition` (the values of which constitute a state)
- `InputProposition` (which are adjusted based on each move)
- `ViewProposition` (input is a single connective)
- `Constant` (`value = true`)

Methods for marking the propnet  
Using backwards propagation, the base and input propositions of the propnet must be marked after each move/change in the game state. The markbases method takes in a state (as it would be represented in a non-propnet program) and marks the base propositions that are true in the state. The markactions method does the same for the input propositions.

Methods for traversing the propnet (`propmarkp`, etc)  
It is necessary to traverse the propnet when querying information about the game, such as a player’s legal actions or whether a state is terminal. Using backwards propagation, once the base and input propositions have been marked, the value of any proposition in the propnet (i.e. terminal) can be recursively computed from the markings of the base, input, and constant propositions.

GGP methods using the propnet  
The player itself can then use the same types of functions as it would with a regular game description.
- `proplegals` is the equivalent of `findlegals` in the regular JS codebase
- `propnext` is the equivalent of `simulate`
- `isterminal` is the equivalent of `findterminalp`
- `getreward` is the equivalent of `findrewards`
There are two additional methods (`groupactions` and `groupresponses`) that provide convenience for different player strategies. (For the most part, the names of these methods are taken from the Java PropNetStateMachine implementation.)



Note: still encountering a bug on Kono, but this was happening even before the propnet implementation so I’m not sure why that might be.
