export interface TranscriptSegment {
  time: string;
  seconds: number;
  speaker: string;
  text: string;
  translatedText?: string;
  audio?: string | null;
}

export const STATIC_TRANSCRIPTS: Record<string, TranscriptSegment[]> = {
  "trump1-speech": [
    {
      "time": "00:00",
      "seconds": 0,
      "speaker": "Reporter",
      "text": "Trump posted over the holiday about changing New Mexico's name to New America."
    },
    {
      "time": "00:05",
      "seconds": 5,
      "speaker": "Reporter",
      "text": "The backlash was swift as you might expect. New Mexico's Governor said it isn't up for debate, adding while the White House wasted time on coloring maps, her state is busy doing the work."
    },
    {
      "time": "00:13",
      "seconds": 13,
      "speaker": "Reporter",
      "text": "Even a Republican running for governor there said the state does not need a new name. To be clear, it is up to the voters, not the president."
    },
    {
      "time": "00:20",
      "seconds": 20,
      "speaker": "Reporter",
      "text": "Still, Trump has already shown he's serious. Just last week, he signed an executive order renaming Lake Ontario to Lake America."
    }
  ],
  "trump1": [
    {
      "time": "00:00",
      "seconds": 0,
      "speaker": "Reporter",
      "text": "Trump posted over the holiday about changing New Mexico's name to New America."
    },
    {
      "time": "00:05",
      "seconds": 5,
      "speaker": "Reporter",
      "text": "The backlash was swift as you might expect. New Mexico's Governor said it isn't up for debate, adding while the White House wasted time on coloring maps, her state is busy doing the work."
    },
    {
      "time": "00:13",
      "seconds": 13,
      "speaker": "Reporter",
      "text": "Even a Republican running for governor there said the state does not need a new name. To be clear, it is up to the voters, not the president."
    },
    {
      "time": "00:20",
      "seconds": 20,
      "speaker": "Reporter",
      "text": "Still, Trump has already shown he's serious. Just last week, he signed an executive order renaming Lake Ontario to Lake America."
    }
  ],
  "fishing-flats-bonaire": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Guide Chris",
    "text": "Welcome to Bonaire Flatventures. Today we are heading out early across the southern saltwater flats in search of tailing bonefish."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Angler Mark",
    "text": "The clarity of the water here in Bonaire is second to none. You can spot the fish moving from thirty yards out."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Guide Chris",
    "text": "Keep your presentation low and gentle. When the wind picks up off the Caribbean sea, accuracy makes all the difference."
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "Angler Mark",
    "text": "Hooked up! That first initial run is pure speed. Bonaire flats are truly a world-class fly fishing destination."
  },
  {
    "time": "01:10",
    "seconds": 70,
    "speaker": "Guide Chris",
    "text": "Gentle release back into the reef shallows. Remember to protect the marine park ecosystem whenever you visit."
  }
],
  "o_WnhXfjmNI": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Guide Chris",
    "text": "Welcome to Bonaire Flatventures. Today we are heading out early across the southern saltwater flats in search of tailing bonefish."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Angler Mark",
    "text": "The clarity of the water here in Bonaire is second to none. You can spot the fish moving from thirty yards out."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Guide Chris",
    "text": "Keep your presentation low and gentle. When the wind picks up off the Caribbean sea, accuracy makes all the difference."
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "Angler Mark",
    "text": "Hooked up! That first initial run is pure speed. Bonaire flats are truly a world-class fly fishing destination."
  },
  {
    "time": "01:10",
    "seconds": 70,
    "speaker": "Guide Chris",
    "text": "Gentle release back into the reef shallows. Remember to protect the marine park ecosystem whenever you visit."
  }
],
  "fishing-action-bonaire": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Captain Henson",
    "text": "What is up everyone! Hooked with Henson here live from the coastal shores of Kralendijk, Bonaire."
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Captain Henson",
    "text": "We are targeting reef predators and fast pelagics right off the drop-off where the deep blue meets the turquoise shelf."
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "Mate Luis",
    "text": "Fish on! We got a solid strike on the surface popper. Look at the color on this Caribbean jack."
  },
  {
    "time": "00:45",
    "seconds": 45,
    "speaker": "Captain Henson",
    "text": "Incredible fight! Bonaire delivers non-stop action whether you are fishing from shore or chartering offshore."
  }
],
  "JacXylo4d8w": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Captain Henson",
    "text": "What is up everyone! Hooked with Henson here live from the coastal shores of Kralendijk, Bonaire."
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Captain Henson",
    "text": "We are targeting reef predators and fast pelagics right off the drop-off where the deep blue meets the turquoise shelf."
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "Mate Luis",
    "text": "Fish on! We got a solid strike on the surface popper. Look at the color on this Caribbean jack."
  },
  {
    "time": "00:45",
    "seconds": 45,
    "speaker": "Captain Henson",
    "text": "Incredible fight! Bonaire delivers non-stop action whether you are fishing from shore or chartering offshore."
  }
],
  "coral-decontamination-bonaire": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "STINAPA Ranger",
    "text": "Protecting the coral reef ecosystem of Bonaire National Marine Park is our collective responsibility."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Marine Biologist",
    "text": "To prevent the spread of coral tissue loss disease, all divers must decontaminate their wetsuits, booties, and BCDs."
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "STINAPA Ranger",
    "text": "Submerge gear in the designated antibacterial wash stations available at dive shops before entering new dive sites."
  },
  {
    "time": "00:55",
    "seconds": 55,
    "speaker": "Marine Biologist",
    "text": "Together, we ensure our pristine coral gardens thrive for generations to come. Thank you for your stewardship."
  }
],
  "laVvK0FgF5A": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "STINAPA Ranger",
    "text": "Protecting the coral reef ecosystem of Bonaire National Marine Park is our collective responsibility."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Marine Biologist",
    "text": "To prevent the spread of coral tissue loss disease, all divers must decontaminate their wetsuits, booties, and BCDs."
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "STINAPA Ranger",
    "text": "Submerge gear in the designated antibacterial wash stations available at dive shops before entering new dive sites."
  },
  {
    "time": "00:55",
    "seconds": 55,
    "speaker": "Marine Biologist",
    "text": "Together, we ensure our pristine coral gardens thrive for generations to come. Thank you for your stewardship."
  }
],
  "buddy-dive-resort-bonaire": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Lake Hickory Scuba",
    "text": "Welcome to Buddy Dive Resort in Bonaire, renowned as the shore diving capital of the Caribbean."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Host",
    "text": "From the world-famous drive-thru air tank fill station to the thriving house reef right off the dock, diving here is effortless."
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "Host",
    "text": "Load up your rental truck with tanks, pick a yellow dive marker along the coast, and step right into the ocean."
  },
  {
    "time": "00:58",
    "seconds": 58,
    "speaker": "Guest Diver",
    "text": "You can do four to five dives a day easily on your own schedule. There is no other dive destination like Bonaire."
  }
],
  "lYX8w9HXMR4": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Lake Hickory Scuba",
    "text": "Welcome to Buddy Dive Resort in Bonaire, renowned as the shore diving capital of the Caribbean."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Host",
    "text": "From the world-famous drive-thru air tank fill station to the thriving house reef right off the dock, diving here is effortless."
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "Host",
    "text": "Load up your rental truck with tanks, pick a yellow dive marker along the coast, and step right into the ocean."
  },
  {
    "time": "00:58",
    "seconds": 58,
    "speaker": "Guest Diver",
    "text": "You can do four to five dives a day easily on your own schedule. There is no other dive destination like Bonaire."
  }
],
  "complete-guide-bonaire": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Globetrotting Gang",
    "text": "Planning your trip to Bonaire? Here is our ultimate traveler guide containing 58 essential dos and don'ts."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Travel Host",
    "text": "From driving laws and flamingo sanctuaries in Washington Slagbaai National Park to windsurfing at Lac Bay, we cover it all."
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "Travel Host",
    "text": "Make sure to carry the Bonaire Nature Fee tag, bring reef-safe sunscreen, and enjoy the delicious culinary scene in Kralendijk."
  },
  {
    "time": "00:58",
    "seconds": 58,
    "speaker": "Globetrotting Gang",
    "text": "Hit subscribe for more Caribbean travel itineraries and insider island tips."
  }
],
  "xajKPqVCCbc": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Globetrotting Gang",
    "text": "Planning your trip to Bonaire? Here is our ultimate traveler guide containing 58 essential dos and don'ts."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Travel Host",
    "text": "From driving laws and flamingo sanctuaries in Washington Slagbaai National Park to windsurfing at Lac Bay, we cover it all."
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "Travel Host",
    "text": "Make sure to carry the Bonaire Nature Fee tag, bring reef-safe sunscreen, and enjoy the delicious culinary scene in Kralendijk."
  },
  {
    "time": "00:58",
    "seconds": 58,
    "speaker": "Globetrotting Gang",
    "text": "Hit subscribe for more Caribbean travel itineraries and insider island tips."
  }
],
  "CytqhMMV7sQ": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Courtney Bee",
    "text": "Welcome to We Playin' Spades at the turquoise table! I am Courtney Bee alongside Nick Cannon, and we have the one and only Tiffany Haddish in the house."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Tiffany Haddish",
    "text": "Listen, I came here to take all the books. Do not renege on my watch because I will call you out in front of everybody!"
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "Nick Cannon",
    "text": "Tiffany is already talking trash before the cards are even dealt. What is your bid Courtney?"
  },
  {
    "time": "00:42",
    "seconds": 42,
    "speaker": "Courtney Bee",
    "text": "I am bidding a confident four. You better have those side kings Nick, because we are not dropping bags tonight!"
  },
  {
    "time": "01:00",
    "seconds": 60,
    "speaker": "Tiffany Haddish",
    "text": "Watch how I cut this ace! That is a book right there. High stakes, real comedy, let's go!"
  }
],
  "pd5J_kQqLB0": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Courtney Bee",
    "text": "We back at the Spades table and tonight we have global pro wrestling superstar Mercedes Moné joining the game."
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Mercedes Moné",
    "text": "In the ring or at the card table, I always come out victorious. Moné changes everything, including these bids."
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "Nick Cannon",
    "text": "You gotta love the championship energy. But Spades requires teamwork and mind reading. Let's see the opening lead."
  },
  {
    "time": "00:40",
    "seconds": 40,
    "speaker": "Courtney Bee",
    "text": "Throw the big joker early and let's clear the board! Don't hold back on us Mercedes."
  },
  {
    "time": "00:56",
    "seconds": 56,
    "speaker": "Mercedes Moné",
    "text": "That's how we do it! Drop your thoughts in the comments if you think we took the set."
  }
],
  "z-aLgC2W_mk": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Bob Cicherillo",
    "text": "And the 2024 Mr. Olympia champion of the world... Samson Dauda!"
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Samson Dauda",
    "text": "This moment is a dream come true. To everyone who supported me, my wife, my team, thank you from the bottom of my heart."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Shawn Ray",
    "text": "Samson brought symmetry, classical lines, and unbelievable condition that dominated the main stage in Las Vegas."
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "Dennis James",
    "text": "He proved that when size meets elegance and flow, you get an undisputed Sandow champion."
  }
],
  "c-bum-6x-win": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Commentator",
    "text": "Ladies and gentlemen, stepping on stage for his final Classic Physique routine... 6-time champion Chris Bumstead."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Chris Bumstead",
    "text": "Every time I step onto that stage, I give everything I have to the art of posing and the classic era."
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "Commentator",
    "text": "Look at the vacuum pose, the sweep of the quads, and the flow of the upper body. A true modern masterpiece."
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "Commentator",
    "text": "The crowd on their feet in Las Vegas honoring one of the greatest champions in fitness history."
  }
],
  "y3nBv9p1oFg": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Commentator",
    "text": "Ladies and gentlemen, stepping on stage for his final Classic Physique routine... 6-time champion Chris Bumstead."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Chris Bumstead",
    "text": "Every time I step onto that stage, I give everything I have to the art of posing and the classic era."
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "Commentator",
    "text": "Look at the vacuum pose, the sweep of the quads, and the flow of the upper body. A true modern masterpiece."
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "Commentator",
    "text": "The crowd on their feet in Las Vegas honoring one of the greatest champions in fitness history."
  }
],
  "SV7JP7y80UM": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Bob Cicherillo",
    "text": "Welcome back to OlympiaTV. Today we are having the ultimate debate on the 212 division."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Shawn Ray",
    "text": "This division has grown so much. We have seen champions like Flex Lewis dominate in the past."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Bob Cicherillo",
    "text": "Exactly, Shawn. But this year, the competition is closer than ever. Who is your pick?"
  },
  {
    "time": "00:48",
    "seconds": 48,
    "speaker": "Shawn Ray",
    "text": "I think conditioning is going to be the deciding factor. You cannot hide any flaws on the Olympia stage."
  },
  {
    "time": "01:05",
    "seconds": 65,
    "speaker": "Dennis James",
    "text": "Don't count out the newcomers. We have some guys coming in with incredible thickness and roundness."
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "Bob Cicherillo",
    "text": "Let's take a look at the side chest comparison and break down the top contenders."
  }
],
  "MzWgJtFIxg8": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Narrator",
    "text": "Throughout history, only a handful of athletes have truly redefined the sport of bodybuilding."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Arnold Schwarzenegger",
    "text": "When I came to America, my goal was not just to win Mr. Olympia, but to make bodybuilding popular worldwide."
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "Dorian Yates",
    "text": "In the nineties, I knew I had to bring something completely different. High-intensity training and pure density."
  },
  {
    "time": "00:52",
    "seconds": 52,
    "speaker": "Phil Heath",
    "text": "Bodybuilding is about evolution. Arnold brought the aesthetics, Dorian brought the mass, and we continue to push those boundaries."
  },
  {
    "time": "01:10",
    "seconds": 70,
    "speaker": "Narrator",
    "text": "These game changers paved the way for the modern legends we see on stage today."
  }
],
  "NMjCB0Y2rh4": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Host",
    "text": "The year is 2007. The venue is the Orleans Arena in Las Vegas. Mr. Olympia is underway."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Victor Martinez",
    "text": "I felt like I was in the best shape of my life. The details, the separation—everything came together."
  },
  {
    "time": "00:29",
    "seconds": 29,
    "speaker": "Jay Cutler",
    "text": "It was a battle. Victor came in sharp and full. I had to fight for every single pose."
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "Chris Aceto",
    "text": "Many experts and fans to this day believe Victor should have taken the Sandow home that night."
  },
  {
    "time": "01:02",
    "seconds": 62,
    "speaker": "Victor Martinez",
    "text": "In bodybuilding, you respect the judges' decision, but the support from the fans that year was unforgettable."
  }
],
  "P0Ivio8Onew": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Nick",
    "text": "Hey guys, Nick here from Nick's Strength and Power. Today we are talking about the Toronto Pro."
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "Nick",
    "text": "Hassan Mostafa was in incredible shape, but some bodybuilders are saying he was robbed of first place."
  },
  {
    "time": "00:22",
    "seconds": 22,
    "speaker": "Nick",
    "text": "If you look at the side-by-side comparison, his size and fullness are absolutely undeniable."
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "Nick",
    "text": "Let me know in the comments: do you think Hassan should have won the Sandow qualification here?"
  }
],
  "GJkBAbzrhkQ": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Nick",
    "text": "Welcome back. Today we are focusing on Hassan Mostafa's side chest pose, which is absolutely insane."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Nick",
    "text": "The sheer thickness of his chest and the detail in his delts and hamstrings is mind-blowing."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Nick",
    "text": "He has some of the best muscle bellies in the game right now. Let's break down his posing routine."
  }
],
  "dTqpdNacxYM": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Jay Cutler",
    "text": "Hey guys, Jay Cutler here with DT Roth answering your top training and nutrition questions."
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Jay Cutler",
    "text": "People always ask me about chest volume during the off-season. You need progressive overload with strict mind-muscle connection."
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "DT Roth",
    "text": "Jay, how do you manage recovery and meal frequency when pushing maximum mass?"
  },
  {
    "time": "00:42",
    "seconds": 42,
    "speaker": "Jay Cutler",
    "text": "Consistency is everything. Eating every two and a half hours, drinking enough electrolytes, and getting quality sleep is non-negotiable."
  }
],
  "fxl8zZId73g": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "DT Roth",
    "text": "Welcome back! Today we are doing a deep dive breakdown on Cutler Nutrition's Prevail Focus pre-workout."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "DT Roth",
    "text": "What makes Prevail unique is the precise blend of nootropics, L-tyrosine, and neuro-enhancers that give clean, sustained energy without crashing."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "DT Roth",
    "text": "Whether you are hitting heavy squats or prepping for a posing routine, mental focus is half the battle."
  }
],
  "mQ6X2g9w7Ew": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Frank Sepe",
    "text": "Welcome to Muscle & Fitness Sleeveless! I am Frank Sepe here with celebrity trainer Don Saladino."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Don Saladino",
    "text": "Today we are bringing you an explosive Chest and Biceps workout live from the gym floor."
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "Frank Sepe",
    "text": "We start with incline dumbbell presses focusing on full stretch at the bottom and hard contraction at the top."
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "Don Saladino",
    "text": "Control the eccentric phase. Tempo and form will build more dense muscle than just ego lifting heavy weights."
  }
],
  "3g6w9w_f_lI": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Frank Sepe",
    "text": "We are back on Sleeveless and today we have Dr. Jordan Shallow, the Muscle Doc, breaking down shoulder mechanics."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Dr. Jordan Shallow",
    "text": "Shoulder health and delt development depend heavily on scapular positioning and rotator cuff activation."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Don Saladino",
    "text": "Most lifters overload lateral raises with too much momentum. Jordan, show us the optimal angle."
  },
  {
    "time": "00:48",
    "seconds": 48,
    "speaker": "Dr. Jordan Shallow",
    "text": "Slight forward lean, elbows leading the movement, and stopping just parallel to avoid impingement."
  }
],
  "v2K5r1K7g-w": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Frank Sepe",
    "text": "It is Leg Day at the East Coast Mecca, Bev Francis Powerhouse Gym with Don Saladino and Maria Moda."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Maria Moda",
    "text": "We are hitting heavy hack squats, Bulgarian split squats, and high-volume hamstring curls."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Don Saladino",
    "text": "Leg training builds the metabolic furnace for your entire body. Push through the burn!"
  }
],
  "kYJv1zT05C8": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Frank Sepe",
    "text": "Welcome to our targeted abdominal and core routine live from Long Island."
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Don Saladino",
    "text": "To get a ripped midsection, it is about breathing control, pelvic stability, and isometric holds."
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "Frank Sepe",
    "text": "Follow along for this 15-minute ab burner you can do right at home or in the gym."
  }
],
  "kYJ-pL-l6sQ": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Announcer",
    "text": "Center stage at the 2025 Rising Phoenix World Championships: Andrea Shaw and Natalia Kovaleva!"
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Judge",
    "text": "Front double bicep pose... turn to the side... side chest pose."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Commentator",
    "text": "The conditioning from Andrea Shaw is immaculate. Natalia brings incredible muscularity and stage presence."
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "Commentator",
    "text": "This is the pinnacle of women's bodybuilding, showcasing elite dedication and athletic greatness."
  }
],
  "F08h_v-LqQk": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Announcer",
    "text": "Please welcome to the stage, 4-time Rising Phoenix World Champion, Andrea Shaw!"
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Commentator",
    "text": "Andrea's posing routine is like poetry in motion. Seamless transitions, perfect musical timing, and absolute control."
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "Commentator",
    "text": "From every angle—front, back, and side—her physique sets the gold standard for modern female bodybuilding."
  }
],
  "F3zWw9Z89Wk": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Lenda Murray",
    "text": "Hello everyone, 8-time Ms. Olympia Lenda Murray here. Today I am sharing my complete back workout for longevity and shape."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Lenda Murray",
    "text": "To build a V-taper without destroying your lower back, you must focus on lat engagement before the pull."
  },
  {
    "time": "00:34",
    "seconds": 34,
    "speaker": "Lenda Murray",
    "text": "Keep your chest proud, depress your shoulder blades, and pull through your elbows. Feel every single rep."
  }
],
  "vVj44vD7x5Y": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Lenda Murray",
    "text": "Let's talk about the Lat Pulldown. Many people pull behind the neck or lean back way too far."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Lenda Murray",
    "text": "The secret is a slight 10-degree lean, engaging the lower lats, and bringing the bar directly to your upper chest."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Lenda Murray",
    "text": "Control the release on the way up to get that deep stretch. That is how you sculpt an Olympia-winning back."
  }
],
  "AUnZcZ_WzS0": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Announcer",
    "text": "Ladies and gentlemen, it is time for the final posedown of the Rising Phoenix World Championships!"
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Commentator",
    "text": "The music is pumping and the top six female athletes are giving the fans everything they have."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Commentator",
    "text": "What an electrifying atmosphere celebrating strength, dedication, and world-class athletic mastery."
  }
],
  "F0f5b9C-Z2I": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Host",
    "text": "Welcome to our historical retrospective on the Rising Phoenix World Championships."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Host",
    "text": "Wings of Strength has elevated women's bodybuilding globally, providing the premier stage for champions worldwide."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Host",
    "text": "Relive the unforgettable battles and timeless routines from the archives."
  }
],
  "p4v5b4mJj4Q": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Dany Garcia",
    "text": "Behind the scenes at my Muscle & Fitness Hers cover shoot. Fitness has been the foundation of my entire entrepreneurial journey."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Dany Garcia",
    "text": "When you build physical discipline in the gym, it carries directly into the boardroom and your creative ventures."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Host",
    "text": "Dany demonstrates her daily strength and conditioning split that keeps her energized and focused."
  }
],
  "XQn3oF5Y1jE": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Charlotte Flair",
    "text": "WWE Superstar Charlotte Flair here for Muscle & Fitness Hers. In pro wrestling, power and agility must work together."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Charlotte Flair",
    "text": "My training blends heavy compound lifts, plyometrics, and mobility so I can perform at the highest level in the ring."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Charlotte Flair",
    "text": "Consistency, passion, and embracing the grind: that is how you build a championship standard."
  }
],
  "iWz1lP5tqO4": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Ava Cowan",
    "text": "IFBB Pro Ava Cowan taking you through a hardcore back training session."
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Ava Cowan",
    "text": "We are incorporating T-bar rows, close-grip pulldowns, and deadlifts for total back thickness."
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "Ava Cowan",
    "text": "Prioritize recovery, fuel your body with clean nutrition, and stay dedicated to your goals."
  }
],
  "vZnLRqD4M-I": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Dorian Yates",
    "text": "Welcome to the Temple Gym in Birmingham. Blood and Guts training with 6-time Mr. Olympia Dorian Yates."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Dorian Yates",
    "text": "We do not count warmups. We take one all-out working set taken beyond positive muscular failure."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Kris Gethin",
    "text": "The intensity is unlike anything else. When Dorian says one more rep, you find the strength deep within."
  },
  {
    "time": "00:48",
    "seconds": 48,
    "speaker": "Dorian Yates",
    "text": "Pull all the way to the abdomen on the barbell row. Squeeze, hold, control the negative. That is how real mass is forged."
  }
],
  "m3JM5-16zkM": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Dorian Yates",
    "text": "Chest and Biceps today on Blood and Guts. Incline dumbbell press followed by heavy dumbbell flyes."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Dorian Yates",
    "text": "Do not bounce the dumbbells at the bottom. Full stretch, lock your elbows slightly bent, and squeeze the pecs together."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Kris Gethin",
    "text": "Every muscle fiber is burning. High-Intensity Training requires complete mental focus before every set."
  }
],
  "A4L4f0Ja4iM": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Dorian Yates",
    "text": "Shoulders and Triceps session. Overhead dumbbell press into seated side laterals."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Dorian Yates",
    "text": "Keep the tension continuous throughout the movement. No swinging, pure deliberate execution."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Dorian Yates",
    "text": "Push past the pain threshold. That last forced rep is where the growth happens."
  }
],
  "5BFZ5rg1ZLc": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Pastor John",
    "text": "Welcome to TCT Network. God does not want robotic, routine prayers—He desires your authentic heart."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Pastor John",
    "text": "When you come before the Lord with sincerity and humility, His peace surpasses all understanding."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Pastor John",
    "text": "Trust His timing, walk in faith, and let His love transform every area of your family and daily life."
  }
],
  "vwmCBGEmpY0": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Pastor Michael",
    "text": "God is fighting battles for you right now that your physical eyes cannot even see."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Pastor Michael",
    "text": "Ephesians chapter two reminds us of the unmerited favor and grace bestowed upon us."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Pastor Michael",
    "text": "No matter what obstacle you face today, stand firm knowing that your victory is secured in Christ."
  }
],
  "Z5q63JNeAZs": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Pastor David",
    "text": "There is power in the name of Jesus to heal, restore, and set the captive free."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Pastor David",
    "text": "When we build our households upon the solid rock of God's word, the storms of life cannot shake us."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Pastor David",
    "text": "Let us pray together for healing, peace, and spiritual revival across our communities."
  }
],
  "x2bt6n_Xkq8": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Pastor Frank",
    "text": "Frankly Speaking with Pastor Frank. Be empowered to fulfill your divine purpose and overcome every challenge."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Pastor Frank",
    "text": "You are called, you are equipped, and you have purpose on this earth. Do not let doubt hold you back."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Pastor Frank",
    "text": "Step out boldly in obedience to the vision God placed inside your spirit."
  }
],
  "vdHg6fe8P5Y-bulletin": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Host Sarah",
    "text": "Attention Central Texas! Here is your local public service announcement and community bulletin."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Host Sarah",
    "text": "Highlighting upcoming volunteer drives, health fairs, and family educational events across Killeen and Temple."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Host Sarah",
    "text": "Get involved in your neighborhood and support our local Central Texas non-profit partners."
  }
],
  "vdHg6fe8P5Y-veterans": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Officer Davis",
    "text": "Welcome to the Central Texas Veterans Resources Show, dedicated to serving those who served."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Officer Davis",
    "text": "Today we discuss accessing VA healthcare benefits, transition counseling, and career assistance."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Officer Davis",
    "text": "Visit our local resource centers or call the helpline for dedicated support for you and your military family."
  }
],
  "vdHg6fe8P5Y": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Host Sarah",
    "text": "Welcome to Attention Central Texas on KPLE-TV."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Host Sarah",
    "text": "Connecting our local viewers with essential services, civic updates, and community celebrations."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Host Sarah",
    "text": "Stay tuned as we interview local leaders and organizations making an impact in our area."
  }
],
  "EWGs1CV8g_s": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Teacher Mark",
    "text": "The Word of Life on The Walk TV. Exploring the spiritual lessons from the temptation of Jesus in the wilderness."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Teacher Mark",
    "text": "Jesus responded to every temptation with scripture: \"It is written.\" The Word of God is our ultimate shield."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Teacher Mark",
    "text": "Equip your mind daily with scripture so that you can stand victorious in any trial."
  }
],
  "9drtdb9zqy4": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Host Robert",
    "text": "Men of Integrity: walking with honor, spiritual strength, and dedication to family."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Host Robert",
    "text": "Integrity is what you do when nobody is looking. We explore character and leadership in modern society."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Host Robert",
    "text": "Join our weekly men's fellowship and mentorship groups."
  }
],
  "e5PyPssFC5U": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Pastora Mitzi Gibson",
    "text": "Bienvenidos a La Palabra de Vida por Enlace USA. Hoy compartimos el mensaje de una nueva identidad en Cristo."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Pastora Mitzi Gibson",
    "text": "Las cosas viejas pasaron; he aquí todas son hechas nuevas por el amor y la misericordia de Dios."
  },
  {
    "time": "00:34",
    "seconds": 34,
    "speaker": "Pastora Mitzi Gibson",
    "text": "Abra su corazón y reciba la bendición de paz y esperanza para usted y su familia."
  }
],
  "p1k8H32aB_w": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Host James",
    "text": "Welcome to Positiv Cinema Family Movie Night spotlight."
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Host James",
    "text": "Bringing you heartwarming, uplifting stories that inspire, encourage faith, and entertain the entire family."
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "Host James",
    "text": "Check your local broadcast schedule and join us for tonight's featured film presentation."
  }
],
  "TvJHIFotb3s": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Superbook Host",
    "text": "Superbook presents: David and Goliath—A Giant Adventure!"
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Chris Quantum",
    "text": "When Joy and I faced a challenge at school, Superbook took us back to ancient Israel to meet young David."
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "Superbook Host",
    "text": "David taught us that with faith in God, no obstacle is too big to overcome!"
  }
],
  "lgyEYMxzVpw": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "B2K",
    "text": "You're watching B2K. This is the official music video for \"Bump, Bump, Bump\" featuring P. Diddy."
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "Omarion",
    "text": "Written by R. Kelly and produced with iconic early-2000s energy, this track hit number one on the Billboard Hot 100."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Lil' Fizz",
    "text": "Turn up your speakers and enjoy the choreography and classic vibes."
  }
],
  "b2k-clip-1": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "B2K",
    "text": "You're watching B2K. This is the official music video for \"Bump, Bump, Bump\" featuring P. Diddy."
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "Omarion",
    "text": "Written by R. Kelly and produced with iconic early-2000s energy, this track hit number one on the Billboard Hot 100."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Lil' Fizz",
    "text": "Turn up your speakers and enjoy the choreography and classic vibes."
  }
],
  "vibe100-b2k-1": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "B2K",
    "text": "You're watching B2K on VIBE 100. Relive the smash platinum single \"Bump, Bump, Bump\"."
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "Omarion",
    "text": "Shoutout to all the fans who have rocked with B2K from day one to the Millennium tour."
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "Lil' Fizz",
    "text": "Enjoy the video and let us know your favorite dance move in the chat!"
  }
],
  "b2k-clip-2": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "B2K",
    "text": "Welcome back to the B2K channel. Here is the official music video for \"Gots Ta Be\"."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Omarion",
    "text": "This was our soulful ballad that really connected with our fans across the world."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "J-Boog",
    "text": "We hope you enjoy the harmonies and smooth styling of this classic video."
  }
],
  "b2k-clip-3": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "B2K",
    "text": "You're watching B2K. This is the official music video for Girlfriend, off our album Pandemonium."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Omarion",
    "text": "With choreography by Dave Meyers, this video won viewer's choice awards and defined the boyband era."
  },
  {
    "time": "00:17",
    "seconds": 17,
    "speaker": "Lil' Fizz",
    "text": "Let's jump into the music video and look at those classic dance moves."
  }
],
  "6OihwykYdBc": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "B2K",
    "text": "You're watching B2K. This is the official music video for Girlfriend, off our album Pandemonium."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Omarion",
    "text": "With choreography by Dave Meyers, this video won viewer's choice awards and defined the boyband era."
  },
  {
    "time": "00:17",
    "seconds": 17,
    "speaker": "Lil' Fizz",
    "text": "Let's jump into the music video and look at those classic dance moves."
  }
],
  "b2k-clip-4": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Omarion",
    "text": "Hey everyone, Omarion here. Welcome to the official music video for my solo single Touch."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Omarion",
    "text": "Off my debut solo album O, this track features iconic choreography and street-style dancing."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Omarion",
    "text": "Let's watch and feel the rhythm. Don't forget to leave your comments in the chat."
  }
],
  "_Z_5lpErdyM": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Omarion",
    "text": "Hey everyone, Omarion here. Welcome to the official music video for my solo single Touch."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Omarion",
    "text": "Off my debut solo album O, this track features iconic choreography and street-style dancing."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Omarion",
    "text": "Let's watch and feel the rhythm. Don't forget to leave your comments in the chat."
  }
],
  "b2k-clip-5": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Lil' Fizz",
    "text": "Welcome back. This is Lil' Fizz, showing you the official video for my solo track Fluid."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Missez",
    "text": "Featuring the amazing vocals of Missez, this single is a club banger with heavy beats."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Lil' Fizz",
    "text": "Check out the performance and let me know if you are vibing with it."
  }
],
  "AdJEg47RTZ4": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Lil' Fizz",
    "text": "Welcome back. This is Lil' Fizz, showing you the official video for my solo track Fluid."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Missez",
    "text": "Featuring the amazing vocals of Missez, this single is a club banger with heavy beats."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Lil' Fizz",
    "text": "Check out the performance and let me know if you are vibing with it."
  }
],
  "b2k-clip-6": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Big Boy",
    "text": "Welcome to Big Boy TV. Today we sit down with J-Boog and the group to talk about B2K's history."
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "J-Boog",
    "text": "We talk about the Millennium reunion tour, the brotherhood, and what it's like performing together again."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Big Boy",
    "text": "It's a candid conversation about the highs and lows of being one of the biggest R and B groups."
  }
],
  "JwIHOk7b5sQ": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Big Boy",
    "text": "Welcome to Big Boy TV. Today we sit down with J-Boog and the group to talk about B2K's history."
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "J-Boog",
    "text": "We talk about the Millennium reunion tour, the brotherhood, and what it's like performing together again."
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Big Boy",
    "text": "It's a candid conversation about the highs and lows of being one of the biggest R and B groups."
  }
],
  "b2k-clip-7": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Omarion",
    "text": "Hey guys, Omarion here. Let's watch the official music video for Ice Box, produced by Timbaland."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Omarion",
    "text": "This platinum single is about the struggles of love and has a very deep, emotional vibe."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Timbaland",
    "text": "The visual effects and choreography in this video are some of my best work."
  }
],
  "OJl-628FyIk": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Omarion",
    "text": "Hey guys, Omarion here. Let's watch the official music video for Ice Box, produced by Timbaland."
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "Omarion",
    "text": "This platinum single is about the struggles of love and has a very deep, emotional vibe."
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Timbaland",
    "text": "The visual effects and choreography in this video are some of my best work."
  }
],
  "vyqy7PcDGLM": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Karl Ravech",
    "text": "Karl Ravech joining The Pat McAfee Show live to break down the Men's College World Series experience in Omaha."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Pat McAfee",
    "text": "The energy, the tailgating, the passion from collegiate fans is on a completely different level."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "Karl Ravech",
    "text": "We have star pitchers with electric fastballs and powerhouse offenses going head-to-head for the national championship."
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "Pat McAfee",
    "text": "Omaha in June is absolute paradise for baseball fans. Let's look at the top contenders."
  }
],
  "MCWS-experience": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "AVO Host",
    "text": "Welcome to the Men's College World Series Tailgate Gear Showcase with AVO."
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "AVO Host",
    "text": "We are showing off the ultimate collegiate game-day essentials, custom hoodies, and tournament arrivals."
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "AVO Host",
    "text": "Represent your school colors with premium embroidered apparel engineered for all-day comfort."
  }
],
  "avo-lifestyle": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "AVO Stylist",
    "text": "Welcome to the AVO Premium College Apparel Style Guide."
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "AVO Stylist",
    "text": "From campus lecture halls to weekend tailgate parties, here is how to layer and style the latest AVO drop."
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "AVO Stylist",
    "text": "Check out the limited edition oversized hoodies and fleece joggers available now in the shop."
  }
],
  "4cqcl3Jy_hw": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "News Anchor",
    "text": "The FAA is making major moves to modernize America's air traffic control tower infrastructure."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Correspondent",
    "text": "Many busy airport towers currently still rely on physical paper flight strips to track aircraft taxiing and routing."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Correspondent",
    "text": "The newly approved digital transition aims to improve real-time communication and enhance runway safety nationwide."
  }
],
  "-d4T5ruaGeA": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Fox Anchor",
    "text": "All right, meantime, here and here to the mayor's word, Mamdani, is ramping up his radical rhetoric after border czar Tom Homan suggested deploying more ICE agents.",
    "isRecorded": true
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "Zohran Mamdani",
    "text": "These kinds of threats, as you've said, from Tom Homan and the Federal Administration, they're not new.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Zohran Mamdani",
    "text": "And neither will our response be.",
    "isRecorded": true
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Zohran Mamdani",
    "text": "We continue to be proud of being a sanctuary city.",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Zohran Mamdani",
    "text": "We continue to be ready to stand up for our immigrant neighbors, and we continue to be ready to use every single tool at our disposal.",
    "isRecorded": true
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "Fox Anchor",
    "text": "And I've said to the President directly that I believe that ICE raids are cruel, and they do nothing to serve in the interests of public safety.",
    "isRecorded": true
  },
  {
    "time": "00:31",
    "seconds": 31,
    "speaker": "Fox Anchor",
    "text": "And I do believe it's a rogue agency that should be abolished because we need an approach to immigration in this country that has more humanity at the heart of it.",
    "isRecorded": true
  },
  {
    "time": "00:39",
    "seconds": 39,
    "speaker": "Fox Anchor",
    "text": "Former ICE Director and DHS Deputy Assistant Secretary Jonathan Fehi joins me now, Jonathan.",
    "isRecorded": true
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "Fox Anchor",
    "text": "Thank you for joining us this morning.",
    "isRecorded": true
  },
  {
    "time": "00:46",
    "seconds": 46,
    "speaker": "Jonathan Fahey",
    "text": "You know, we've heard the mayor say things like this before he's doubling down once again.",
    "isRecorded": true
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "Jonathan Fahey",
    "text": "So let's live in a world for a moment where he gets his wish and ICE is abolished in cities and states across the country.",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "Jonathan Fahey",
    "text": "What would that actually look like in practice?",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "Jonathan Fahey",
    "text": "Would we live in a more humane society as the way the mayor is predicting?",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "Jonathan Fahey",
    "text": "We would live in a society that is significantly less safe.",
    "isRecorded": true
  },
  {
    "time": "01:12",
    "seconds": 72,
    "speaker": "Jonathan Fahey",
    "text": "Places like New York would be utterly bankrupt because remember under the Biden administration with the open borders policies",
    "isRecorded": true
  },
  {
    "time": "01:20",
    "seconds": 80,
    "speaker": "Jonathan Fahey",
    "text": "that only were four years, New York City was going broke.",
    "isRecorded": true
  },
  {
    "time": "01:24",
    "seconds": 84,
    "speaker": "Jonathan Fahey",
    "text": "They were mayor Adams was asking for $12 billion from the federal government to pay for all the services that illegal aliens were costing the city.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "Jonathan Fahey",
    "text": "And that was just on a short period of time.",
    "isRecorded": true
  },
  {
    "time": "01:36",
    "seconds": 96,
    "speaker": "Jonathan Fahey",
    "text": "So if you actually got rid of ICE, we would see murder skyrocket.",
    "isRecorded": true
  },
  {
    "time": "01:41",
    "seconds": 101,
    "speaker": "Jonathan Fahey",
    "text": "We'd see crime skyrocket.",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "Jonathan Fahey",
    "text": "We would all be poor or less safe.",
    "isRecorded": true
  },
  {
    "time": "01:45",
    "seconds": 105,
    "speaker": "Jonathan Fahey",
    "text": "And it would be a devastating effect because you cannot have ICE and the border go hand in hand.",
    "isRecorded": true
  },
  {
    "time": "01:52",
    "seconds": 112,
    "speaker": "Jonathan Fahey",
    "text": "If you stop enforcing internal immigration laws, the border will be overrun again because part of the deterrence is the fact that people once they get in here aren't getting to stay anymore,",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "Jonathan Fahey",
    "text": "which we didn't have under sort of the open border Biden policy.",
    "isRecorded": true
  },
  {
    "time": "02:06",
    "seconds": 126,
    "speaker": "Jonathan Fahey",
    "text": "So it's a complete joke because he says this under the umbrella of protection that Donald Trump is providing New York by by shutting the border",
    "isRecorded": true
  },
  {
    "time": "02:16",
    "seconds": 136,
    "speaker": "Jonathan Fahey",
    "text": "and deporting the bad guys.",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "Jonathan Fahey",
    "text": "And remember since Trump took office, crime in New York has dropped dramatically and a lot of it is because he's getting rid of the bad guys that were allowed to stay",
    "isRecorded": true
  },
  {
    "time": "02:27",
    "seconds": 147,
    "speaker": "Jonathan Fahey",
    "text": "during the previous administration.",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "Jonathan Fahey",
    "text": "It's a total joke under my dummies side.",
    "isRecorded": true
  },
  {
    "time": "02:33",
    "seconds": 153,
    "speaker": "Jonathan Fahey",
    "text": "He knows it is, but it's completely self-serving today for him and today's Democratic Party.",
    "isRecorded": true
  },
  {
    "time": "02:38",
    "seconds": 158,
    "speaker": "Jonathan Fahey",
    "text": "You know, Jonathan, I think that's some of the things Mayor Mom Dami said in that little sound bite we played bare repeating.",
    "isRecorded": true
  },
  {
    "time": "02:43",
    "seconds": 163,
    "speaker": "Jonathan Fahey",
    "text": "One of them is we continue to be ready to stand up for our immigrant neighbors.",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "Jonathan Fahey",
    "text": "We also said I believe that ice raids are cruel and they do nothing to serve the interest of public safety.",
    "isRecorded": true
  },
  {
    "time": "02:56",
    "seconds": 176,
    "speaker": "Jonathan Fahey",
    "text": "I wonder what he would say to the parents of Sheridan Gorman in his desire to not turn over illegal immigrants to federal law enforcement when their daughter was allegedly killed by",
    "isRecorded": true
  },
  {
    "time": "03:06",
    "seconds": 186,
    "speaker": "Jonathan Fahey",
    "text": "an illegal immigrant with a criminal record.",
    "isRecorded": true
  },
  {
    "time": "03:09",
    "seconds": 189,
    "speaker": "Jonathan Fahey",
    "text": "Maybe there's nothing you can say to a family like that and that's the point.",
    "isRecorded": true
  },
  {
    "time": "03:12",
    "seconds": 192,
    "speaker": "Jonathan Fahey",
    "text": "That's part of the story when you talk about cruel and inhumane, don't those families matter.",
    "isRecorded": true
  },
  {
    "time": "03:19",
    "seconds": 199,
    "speaker": "Jonathan Fahey",
    "text": "Right, exactly.",
    "isRecorded": true
  },
  {
    "time": "03:20",
    "seconds": 200,
    "speaker": "Jonathan Fahey",
    "text": "And our politicians here are supposed to be representing American citizens, not illegal aliens.",
    "isRecorded": true
  },
  {
    "time": "03:26",
    "seconds": 206,
    "speaker": "Jonathan Fahey",
    "text": "And you go back, you have Sheridan Gorman in Chicago, but you also have Lake and Riley in Georgia and remember, her killer was arrested",
    "isRecorded": true
  },
  {
    "time": "03:34",
    "seconds": 214,
    "speaker": "Jonathan Fahey",
    "text": "in New York City released under their sanctuary policies albeit the DHS under mayorkers wasn't even trying to arrest him, but it just shows there's the cruelty",
    "isRecorded": true
  },
  {
    "time": "03:45",
    "seconds": 225,
    "speaker": "Jonathan Fahey",
    "text": "and your responsibility as a mayor, as an elected official in America is to defend American citizens.",
    "isRecorded": true
  },
  {
    "time": "03:52",
    "seconds": 232,
    "speaker": "Jonathan Fahey",
    "text": "And there's such an indifference.",
    "isRecorded": true
  },
  {
    "time": "03:54",
    "seconds": 234,
    "speaker": "Jonathan Fahey",
    "text": "It's not, it's cruelty and just indifference to American suffering because you see it every day and when Donald Trump is trying to enforce",
    "isRecorded": true
  },
  {
    "time": "04:03",
    "seconds": 243,
    "speaker": "Jonathan Fahey",
    "text": "the immigration laws, he's making us safer and the Democrats stand in the way every step of the way when he's simply trying to enforce the laws passed by Congress.",
    "isRecorded": true
  },
  {
    "time": "04:13",
    "seconds": 253,
    "speaker": "Jonathan Fahey",
    "text": "That's back and forth isn't going anywhere.",
    "isRecorded": true
  },
  {
    "time": "04:15",
    "seconds": 255,
    "speaker": "Fox Anchor",
    "text": "It continues into today.",
    "isRecorded": true
  },
  {
    "time": "04:16",
    "seconds": 256,
    "speaker": "Fox Anchor",
    "text": "Thank you so much for joining us. We appreciate it.",
    "isRecorded": true
  },
  {
    "time": "04:19",
    "seconds": 259,
    "speaker": "Fox Anchor",
    "text": "Be sure to like and subscribe for all the Fox News latest on YouTube and catch full shows streaming now on Fox One.",
    "isRecorded": true
  }
],
  "ciq7HeiJCOE": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Ashley Parker",
    "text": "Reporting on the historic UFC event hosted on the South Lawn for America's 250th celebration."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Analyst",
    "text": "Political commentators and sports media analyze the cultural crossover between major combat sports and national politics."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Ashley Parker",
    "text": "Here is how fans and political observers are responding across the country."
  }
],
  "HPiqxMrKMKQ": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Entertainment Host",
    "text": "People Weekly exclusive: Billy Ray Cyrus opens up about his relationship with Elizabeth Hurley."
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Billy Ray Cyrus",
    "text": "We connected over our mutual love for music and storytelling. Life always surprises you in the best ways."
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Entertainment Host",
    "text": "Fans have been celebrating the couple across social media following their recent red carpet appearance."
  }
],
  "vwOxJJ80t3k": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "CNBC Reporter",
    "text": "Why fast-food icon KFC has been losing market share in the United States chicken wars."
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Industry Analyst",
    "text": "Competitors like Chick-fil-A, Raising Cane's, and Popeyes have captured consumer demand with simplified menus and tenders."
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "CNBC Reporter",
    "text": "We examine Yum Brands' strategy to revamp their menu, modernize drive-thrus, and reclaim the fast food chicken throne."
  }
],
};

export function getLocalTranscript(videoId: string): TranscriptSegment[] | null {
  if (!videoId) return null;
  const raw = STATIC_TRANSCRIPTS[videoId];
  if (!raw) return null;
  return raw.map(s => ({ ...s, isRecorded: true } as any));
}
