#js-final-project

---Devlog---

July 15th, 2022

    Had some solid ideas for the final project, then went to create the app to find that I had run out of disk space, which is crazy. I actually managed to use up 20gb of just web dev projects. Anyway, some furious googling and dicking around with storage allocation later, I've got plenty of space for the next projects.

    The outline for this project is to recreate my favourite website. I don't really know what my favourite site is, maybe YouTube? That would be an insane amount of work, take a ton of hosting space, and then what would be on there? Random videos that I upload, since the site is literally not gonna be used by anyone else. TOP also suggests making facebook, twitter or pinterest. Again, these are interesting ideas, but why spend all this effort creating a proper website that even in theory no one would have a reason to use.

    I'm pretty sure the purpose of this project is just to make a larger scale project than those previous. Or at least that's how I'm gonna interpret it. So as usual, I'll make something that differs from the outline by creating a largely original site.

    You know about NFTs. Or at least you heard about them. Collectible things on the blockchain. Here's the thing, the blockchan has been touted as a way to have some nebulous sense of owning things on the internet in a more real way than we have for decades. Your steam library? You don't own that silly. Your CSGO guns? Those aren't REALLY yours. Your WOW account and all its stuff? Fake. Runescape items? More like poofake items. But look at my bitcoin! It's super real, if you ignore that I forgot my password and there is way to access it for as long as I live now. Ah shit, some guy just funged it.

    I'm not personally against the idea of these things existing, but there's an insane amount of misinformation surrounding them, I assume largely for the profit of those with holdings in NFTs and crypto. So my site will be a form of parody of all that. With the magic of APIs, I can give people free access to a gamefied NFT marketplace. And maybe make some crypto bros seethe. Hell, if it's illegal somehow and I get sued, that'll be pretty solid publicity. Imagine club penguin, where you play games to collect coins, but then you can use those coins to buy/sell/trade identical copies of the most popular NFTs. Markets of all kinds are super interesting to me, and being able to play around with the volatile nature of the blockchain ecosystem in a loss-free space sounds like so much fun. 

    Main API fetch for the NFTs is done. Not sure how I'll do pricing yet, but I've got a solid base. Tomorrow will start with adding the ability to buy/sell these boys. Might have to implement firebase pretty early on here.

July 16th, 2022

    Fixed the basic layout, which was honestly a bigger mental hurdle than I thought it would be. Gonna add react router dom now.

July 17th, 2022

    Yesterday I added the router and then got tired and played Bug Fables. Today, I'm armed with my Rockstar and am ready to rock this. Now it's time for what may be the most complicated, being able to make accounts and then track those accounts with firebase. 

July 18th, 2022

    Felt like I wasn't going to get much done yesterday. Managed to work the full day, and looking back at what I got done, I'm feeling pretty good. Both firestore and google auth are more or less working as intended, which might end up being some of the most technical parts of this project. Now to store these damn apes in the firestore, allowing me to skip the API call. I think.

    Apes are now stored in the firestore. At least 100 of them are. Should be plenty for my current purposes.

    Things are going shockingly well. You can now spend coins to buy apes, and then have them move to your own inventory and removed from the market firestore db. It all works more or less as intended. Once you're able to put them back up for sale and have that money enter your account, I can start coming up with some simple games.

    So for some reason I wanted to add 3d graphics to this. And I succeeded eventually. Looks fucking cool actually.

July 19th, 2022

    Not sure why, but I feel pretty damn pooped today. Hopefully I can still get some decent work done. Might avoid network stuff today, and try to make some games.

    Made a cool cyber angel for the clicker game. Still not sure what the game is.

    Man, there is a lot to learn if I want to really start integrating three.js into my projects. Definitely no joke. Regardless, I have a little moon orbiting the planet now. It was also pretty easy to incorporate coin logic, so you can now get a random number of coins per click. There's also a chance for the planet to become flooded, giving you a X2 muliplier to coins.

July 20th, 2022

    Should I make a second minigame? I don't know. I'm really tempted to literally learn basic unity and blender so that I can make a better game than the current one. I think Godot also exports to HTML5, so that would also be an option.

    Understaning a bug and fixing it is honestly more gratifying than some of the sex I've had. I hope it's the same for some of you.

    Stole a CSS tricks animation for a loading circle, which looks solid. Represents a timer for clicking a marker. I guess I should explain my rework of the clicker game.

    I more or less threw out the main logic and animations I had in three.js. Might bring back the planet as a visual, but it takes ages to load and is way more finicky than basic divs. In rust, you chop down trees faster by clicking these randomly placed Xs on the trunk. That was the only part of rust I liked, so why not develop it into a full game? The details aren't fleshed out yet, but here's the basic idea. You need to click the randomly placed marker within a time limit, however, there may be multiple different markers to choose from. Hitting different types of markers gives various resources, which get added into your inventory and are eventually condensed into more useful items. This might happen several times for a single item tree, a la 2048 or merge games, which I have found can be quite addictive, but recently not very compelling to play. The progression system is fun though. So after a timer runs out, a new set of markers is presented, but you have to choose which marker will be most beneficial to you, like which marker is the rarest, or which marker might produce an item you actually need in that particular moment. 

July 21st, 2022

    I think I've worked like five full days on this, but somehow it doesn't look like it. Probably because I'm working with a lot of newish stuff to me. Lots of firestore functionality, google auth, and three.js. Would like to have this finished up in about three or four days, but I'm really not sure how much more stuff I'm going to add, or how long it'll take to fix up the store. Plus, I really want some price graphs for the NFTs, but that may be complicated to implement without an actual userbase.

    Spent literally hours trying to get a gif animation to play correctly when mining. Said to myself, "fuck it" and rebuilt it in CSS. Took like 5 minutes and works perfectly

    

---To-Do---

-Avatar generator
-market loading animation
-keep market loaded in once loaded once
-money system
-firebase connectivity
-remove firestore test mode
-have app remember redirect/sign in
-ability to add your own apes back to market 
-custom listing price for apes
-fix ape list/unlist button 
-loading screen for games
-prompts for signing in on non-game sections
-fix workaround timeout on progress ring 