# Second meeting notes


System for validating the trustworthiness of online publications.

## Target audience:
1. Academia
2. General Public

## Data Stored:
Article
- url
- overall score
- paragraph
    - score
    - comment section

User
- friends
- friend scores

Vote
- hash [PK]
- DoC (date of creation)
- trustworthy: true | false | null
- consise: true | false | null

--- 
## Components:

### Extension (React)

Spike Investigate:
- How to parse HTML.
- How to define an extension in terms of config files.
- How to get listed on chrome/firefox/... extension stores

Work:
- Figma prototype
- Integrate UI in websites (votes, threads, links to our platform, pop ups)
- https://www.gwern.net like iframes
- Comment section (popover)


### Website (React)

Investigate:

Work:
- Figma prototype
- Statistics
- Related articles
- Comments
- Manage premium


### Backend (NodeJS)

Work:


## Ideas

Factors on reviewing the article:
- trustworthy
- consise
- false
- vague
- outdated (consider the date of the vote)

Saving scroll state



## Issues / Edge Cases

Article is edited
Resource moved

Streaming: real time reader count

Follow multiple networks (e.g. netflix sub accounts)

Certain areas associated to a network (victor)
