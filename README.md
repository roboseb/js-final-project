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

    Spent literally hours trying to get a gif animation to play correctly when mining. Said to myself, "fuck it" and rebuilt it in CSS. Took like 5 minutes and works perfectly.

July 22nd, 2022

    Pushed the project to github pages using a guide, and it kinda works! I think there are some issues with firestore, so I may have it setup up in test mode or something. Aside from that, the game looks great on my modern phone and is way more natural to play with a touchscreen than a mouse, which was the idea anyway.

    Ran into a little snag. I have a function on a timer loop that draws new markers. It does this by resetting everything and then setting state. What I want it to do is simply take in a usestate to roll dice on which markers to draw. However, it seems it can't read anything but the state from the first time it was called. So I made a little test function that mirrors my timer from the Dragon Quest project. It doesn't work. But it does work in a very similar loop in the Dragon Quest project. Why? I have no idea. The only major struggles I've had in recent memory are all related to usestate. Class components never gave me this much trouble. 

    So, I think, like, useState doesn't work with straight values sometimes? I tweaked the timer to only use a number instead of an array, and it wouldn't update properly. Then I switched it to an array with a single value, and it worked as expected. Fucking react, man.

    Seems that what I want to do is somehow much more complicated than that. Regardless, I now can use an item to increase black chance to 100% or whatever, but I can't for the life of me just swap the values. Gonna leave it as is for now and take a break.

July 24th, 2022

    Ran out of vape juice yesterday, and am planning on quitting by not buying any more. We'll see how that goes.

    Also, I think I want to have this project finished by the end of the 27th at the very latest. Having a better timeframe should help me keep the scope for this fairly reasonable. Four days, here we go.

July 27th, 2022

    So the day I ran out of vape juice turned out to be quite the challenge, so I decided to take my little break over the last few days while adjusting to less nicotine. Feeling decent today, and I think I have some better ideas to get the game moving. Also I hit my forehead on a drive thru sign and might have brain damage. Maybe it's the good kind.

    Changed some very basic functionality early today, and now everything is going well again. Fuck react, but when it works it's so nice. Gonna fry up some pork today.

July 28th, 2022

    Great progress yesterday, and today started off with an ok looking start button animation. Probably will be about a full day to style this project once it's done.

    Today will be adding the ability to create and use the nuke, and deciding whether or not there will be a second planet. Theoretically, most of the framework is already there to simply add some more markers and colour a new planet, so maybe I should give it a shot. Two planets should be decent as a proof of concept. Also, I think once you get to the second planet, you need to keep comboing in that very run to not be sent back to the original planet.

July 29th, 2022

    I'm hoping to have this done in about two days. I need to cut myself off eventually, so that I can actually get it done. Spent way too long with relatively little to show for it.

    Yesterday I spent a few hours just trying to get the green markers to work. See, most markers are gone after a click, and the whole planet resets with new markers. This makes it so that a re-render is not visible. However, green markers require two clicks, and therefore there was a re-render in between the two clicks for some reason, and I'm still not sure why. I fixed this by counting clicks with classes and query selectors instead of useState, and it works like a charm.

    Things still going well. Planet transition is fine, and you can now craft dioxidolatry, which is a nightmare to type out because it's hard to spell and also not a real thing. 

    New mechanic; everytime you increase the multiplier by adding something to hot items, you also decrease the length of the timer. So it's risk/reward beyond even the chance of losing more items as the multiplier increases. Eventually you're gonna have to stop, because eventually the timer will reach 0, making you just lose everything. 

    Second new mechanic; when you clear the first layer of the planet, you get coins, but when you clear the second layer, you get some sort of massive chest, which contains coins in addition to some other stuff. There are also smaller chests which you can get randomly, or at specific multiplier thresholds.

    Fuck me dude. I though the planet cracking animations were cool, but this chest is dope as fuck. I found out by accident that chrome devtools has an animations timing function UI so that I can see real time changes using a graph instead of numbers. Dope as fuck. Most of the game mechanics are there, they should be done by tomorrow. Should also be able to clean up the game UI before the tomorrow's work day is over. Might keep working on this sunday so that I can be done with it. Might still be being optimistic.

Aug 1st, 2022

    God fucking dammit. It's always something getting in the way of this project. There are only two real ISPs in my area, and my landlord uses some weird chinese-targeted third option. Thanks to that, today markes the third day with no internet in the house. Believe it or not, this makes developing websites more difficult.

    I think I can at least polish up the styling and some minor non-DB or auth features while I wait, but not internet in web dev really sucks ass. 

    Holy fuck, internet came back halfway through the day. Already got some solid styling done, but this at least means that the project will be able to be finished eventually. Thank Christ.

    Styling is going ok. Still not 100% sold on the direction, but I think listening to the Neon White ost will help. May have to scrap the fancy start button I love so much.

Aug 2nd, 2022

    Paid off my credit card today, and there's always more money on there than I thought. Oh well. I think I'm gonna be out of cigarettes today, and I'll see if I can quite nicotine after that. We'll see.

    Added a tasteful sci-fi font today. May or may not use it for the entire site and not just the clicker game. Parts of the layout still aren't speaking to me. I think the tenshi art and the vessel are not in the best place. Also, the inventory and recipe panels still aren't lined up and centered somehow.

    Clicker game is decently polished at this point. Gonna cut some corners on features that are unlikely to be seen, but it feels decent to play as is. And it being a react component, I can literally copy paste it into something like a portfolio, and have it run in a little window.

    Got a color scheme and font for the rest of the app, and the general navbar looks like a real navbar now. Time for the fun part, cleaning up the store and assets pages and seeing how much functionality I really wanna have here. Can you sell items? Probably not, at least not now. This project has to end by the end of day tomorrow.

Aug 3rd, 2022

    My phone has been charging at a rate of about 1% per hour, which is a fucking nightmare. Not that I need my phone for most things, but it's infuriating just to have technology not do what it's supposed to. 

    Finished my "last" cigarette yesterday. We'll see how today goes, but so far so good. I felt real shit when I switched from vaping to smoking, and I don't feel bad in the same way right now. Gotta keep working on this project, cause at this point I think I'm gonna wrap it up today. Fix the most necessary and fixible issues, add any reasonably simple features to add, and then move on. Daddy's running out of money and needs a job.




---To-Do---

CANCEL-Avatar generator
-market loading animation
I THINK THIS HAPPENS AUTOMATICALLY?-keep market loaded in once loaded once
DONE-money system
DONE-firebase connectivity
-remove firestore test mode
done-have app remember redirect/sign in
-ability to add your own apes back to market 
-custom listing price for apes
-fix ape list/unlist button 
-loading screen for games
-prompts for signing in on non-game sections
-fix workaround timeout on progress ring 
-add tracking for individual amounts of elements
-add navbar switch for clicker
-change router paths to work with js-final-project/...
-fix vessel filling animation
-save inventory to firestore
-fix app loading in with full screen buttons
CANCEL-option for expanded UI in clicker
CANCEL-dark mode
DONE-add random extra drops from marker nodes
DONE-have consuming items remove one of that item
DONE-add planet transition animation
DONE-add new planet rules/ markers
-more consistent signing in without 403s
DONE-reset test values
-adjust balancing
-better animation for moving from hotitems to inventory
DONE-fix three digit overflow for inventory
DONE-have start button be whole planet
DONE-planet hatching animation
DONE-add coin chest sprite/ planet crack sprite
DONE-add animation for chest transition
-add nuke sprite/animation
DONE-fix tenshi art placeholder
DONE? CANCEL?-get shadow back on tenshi screen
-randomly unlock recipes? or unlock them by crafting
-add all recipes
DONE-fix dioxidaltry
-clicker inventory bug?
-Basic desktop layout