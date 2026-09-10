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
    "text": "Running as now as a man who's been with ESPN since 1993.",
    "isRecorded": true
  },
  {
    "time": "00:03",
    "seconds": 3,
    "speaker": "Karl Ravech",
    "text": "Man who was on the call for the UNC West Virginia game last night.",
    "isRecorded": true
  },
  {
    "time": "00:06",
    "seconds": 6,
    "speaker": "Karl Ravech",
    "text": "And I assume for the next 10 days he'll be on the call for every big game.",
    "isRecorded": true
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "Karl Ravech",
    "text": "Legend friend of the program ladies and gentlemen, Coral Rabbit.",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Karl Ravech",
    "text": "Hey boys, it is good to see you all again.",
    "isRecorded": true
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Karl Ravech",
    "text": "Obviously you're not here this time.",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Karl Ravech",
    "text": "But you'll be back here when they're playing in the college real serious finals.",
    "isRecorded": true
  },
  {
    "time": "00:21",
    "seconds": 21,
    "speaker": "Karl Ravech",
    "text": "I know you will, McAfee.",
    "isRecorded": true
  },
  {
    "time": "00:23",
    "seconds": 23,
    "speaker": "Karl Ravech",
    "text": "They will be back here.",
    "isRecorded": true
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "Karl Ravech",
    "text": "Yeah, definitely.",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "Karl Ravech",
    "text": "I'll tell you when I talk to you that morning, I was playing on never going back to that place ever again.",
    "isRecorded": true
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "Karl Ravech",
    "text": "You know, that was kind of my fault.",
    "isRecorded": true
  },
  {
    "time": "00:33",
    "seconds": 33,
    "speaker": "Karl Ravech",
    "text": "After I get publicly called out to donate and give hundreds of thousands of dollars.",
    "isRecorded": true
  },
  {
    "time": "00:37",
    "seconds": 37,
    "speaker": "Karl Ravech",
    "text": "And I'm basically told that I'm some punk whenever I show up there.",
    "isRecorded": true
  },
  {
    "time": "00:40",
    "seconds": 40,
    "speaker": "Karl Ravech",
    "text": "It was like, okay, interesting place, interesting place here.",
    "isRecorded": true
  },
  {
    "time": "00:43",
    "seconds": 43,
    "speaker": "Karl Ravech",
    "text": "And then we walk around, you know, and before the game we had to do the show.",
    "isRecorded": true
  },
  {
    "time": "00:47",
    "seconds": 47,
    "speaker": "Karl Ravech",
    "text": "So we didn't get to really feel, you know, we kind of go from hotel straight to there.",
    "isRecorded": true
  },
  {
    "time": "00:52",
    "seconds": 52,
    "speaker": "Karl Ravech",
    "text": "And I was fun, fun little story about Thursday night.",
    "isRecorded": true
  },
  {
    "time": "00:55",
    "seconds": 55,
    "speaker": "Karl Ravech",
    "text": "I was in bed.",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "Karl Ravech",
    "text": "The boys are at Jello shots place and I was like, I'm calling in and I got a couple of texts or like, come on, how many times are you going to come to the college real serious?",
    "isRecorded": true
  },
  {
    "time": "01:06",
    "seconds": 66,
    "speaker": "Karl Ravech",
    "text": "This question is first time.",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "Karl Ravech",
    "text": "I'm like, you're right, we got to go win this thing.",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "Karl Ravech",
    "text": "So literally bed to that place and basically walk hotel to, I hadn't really felt it.",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "Karl Ravech",
    "text": "Then I get into that stadium.",
    "isRecorded": true
  },
  {
    "time": "01:17",
    "seconds": 77,
    "speaker": "Karl Ravech",
    "text": "Man, everybody working in that stadium has so much pride for everything that's happening there.",
    "isRecorded": true
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "Karl Ravech",
    "text": "There's two holding rooms, there's two locker rooms.",
    "isRecorded": true
  },
  {
    "time": "01:24",
    "seconds": 84,
    "speaker": "Karl Ravech",
    "text": "Every game is played there.",
    "isRecorded": true
  },
  {
    "time": "01:25",
    "seconds": 85,
    "speaker": "Karl Ravech",
    "text": "So there's a lot of action, a lot of movement, fans have to leave, fans have to come back in all the fans that are there.",
    "isRecorded": true
  },
  {
    "time": "01:30",
    "seconds": 90,
    "speaker": "Karl Ravech",
    "text": "Some of them have been there every single year for like 30, 40 years.",
    "isRecorded": true
  },
  {
    "time": "01:34",
    "seconds": 94,
    "speaker": "Karl Ravech",
    "text": "Some of them pick up teams because they're from Omaha, just want to go to the games.",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "Karl Ravech",
    "text": "So they're adopting teams.",
    "isRecorded": true
  },
  {
    "time": "01:39",
    "seconds": 99,
    "speaker": "Karl Ravech",
    "text": "And then obviously getting to see the baseball culture and it's full.",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "Karl Ravech",
    "text": "It was spectacular.",
    "isRecorded": true
  },
  {
    "time": "01:43",
    "seconds": 103,
    "speaker": "Karl Ravech",
    "text": "I love the vibes.",
    "isRecorded": true
  },
  {
    "time": "01:44",
    "seconds": 104,
    "speaker": "Karl Ravech",
    "text": "I will be back for West Virginia for anything that they play along with.",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "Karl Ravech",
    "text": "I did contribute to the jelly, Jello shot thing.",
    "isRecorded": true
  },
  {
    "time": "01:51",
    "seconds": 111,
    "speaker": "Karl Ravech",
    "text": "So I feel like I did do it all.",
    "isRecorded": true
  },
  {
    "time": "01:53",
    "seconds": 113,
    "speaker": "Karl Ravech",
    "text": "I loved it, Ravi.",
    "isRecorded": true
  },
  {
    "time": "01:54",
    "seconds": 114,
    "speaker": "Karl Ravech",
    "text": "Can you tell me about this year a little bit?",
    "isRecorded": true
  },
  {
    "time": "01:55",
    "seconds": 115,
    "speaker": "Karl Ravech",
    "text": "Because obviously it's our first year really paying attention to it because West Virginia's there.",
    "isRecorded": true
  },
  {
    "time": "01:59",
    "seconds": 119,
    "speaker": "Karl Ravech",
    "text": "Is this been a good year for the World Series?",
    "isRecorded": true
  },
  {
    "time": "02:01",
    "seconds": 121,
    "speaker": "Karl Ravech",
    "text": "Feels like every time I turn it on.",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "Karl Ravech",
    "text": "Something magical is taking place.",
    "isRecorded": true
  },
  {
    "time": "02:05",
    "seconds": 125,
    "speaker": "Karl Ravech",
    "text": "Yeah, it's been a great year.",
    "isRecorded": true
  },
  {
    "time": "02:06",
    "seconds": 126,
    "speaker": "Karl Ravech",
    "text": "And again, look, having you here is really important.",
    "isRecorded": true
  },
  {
    "time": "02:09",
    "seconds": 129,
    "speaker": "Karl Ravech",
    "text": "It helps.",
    "isRecorded": true
  },
  {
    "time": "02:10",
    "seconds": 130,
    "speaker": "Karl Ravech",
    "text": "It's just another level for the college World Series.",
    "isRecorded": true
  },
  {
    "time": "02:13",
    "seconds": 133,
    "speaker": "Karl Ravech",
    "text": "This is a city like Williamsport because I do the little league that really embraces the event.",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "Karl Ravech",
    "text": "I mean, Omaha has been the host to this thing for half a century.",
    "isRecorded": true
  },
  {
    "time": "02:22",
    "seconds": 142,
    "speaker": "Karl Ravech",
    "text": "Down to the last 20 or so years.",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "Karl Ravech",
    "text": "Yeah, it is one of the neatest events.",
    "isRecorded": true
  },
  {
    "time": "02:28",
    "seconds": 148,
    "speaker": "Karl Ravech",
    "text": "And to your point, when you have a Troyer West Virginia here, if you do come to Omaha and you're a fan of just baseball, you tend to side with the teams that have the longest odds.",
    "isRecorded": true
  },
  {
    "time": "02:39",
    "seconds": 159,
    "speaker": "Karl Ravech",
    "text": "You tend to side with Troy's.",
    "isRecorded": true
  },
  {
    "time": "02:41",
    "seconds": 161,
    "speaker": "Karl Ravech",
    "text": "You hop on the West Virginia bandwagon.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "Karl Ravech",
    "text": "Country roads has turned everything around, man.",
    "isRecorded": true
  },
  {
    "time": "02:46",
    "seconds": 166,
    "speaker": "Karl Ravech",
    "text": "I mean, that's turned college baseball fans on their head.",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "Karl Ravech",
    "text": "And if they can win and you can be a part of that, then they're all leading on that.",
    "isRecorded": true
  },
  {
    "time": "02:53",
    "seconds": 173,
    "speaker": "Karl Ravech",
    "text": "And look, I think you guys have talked about it.",
    "isRecorded": true
  },
  {
    "time": "02:56",
    "seconds": 176,
    "speaker": "Karl Ravech",
    "text": "I saw the segment before I came on.",
    "isRecorded": true
  },
  {
    "time": "02:59",
    "seconds": 179,
    "speaker": "Karl Ravech",
    "text": "You make mistakes at this level against really good teams, opportunistic teams like Carolina.",
    "isRecorded": true
  },
  {
    "time": "03:05",
    "seconds": 185,
    "speaker": "Karl Ravech",
    "text": "You're going to lose.",
    "isRecorded": true
  },
  {
    "time": "03:06",
    "seconds": 186,
    "speaker": "Karl Ravech",
    "text": "And those errors last night kill them.",
    "isRecorded": true
  },
  {
    "time": "03:08",
    "seconds": 188,
    "speaker": "Karl Ravech",
    "text": "And they don't ever make those errors.",
    "isRecorded": true
  },
  {
    "time": "03:11",
    "seconds": 191,
    "speaker": "Karl Ravech",
    "text": "And I heard one of your guys talk about just the vastness of center field.",
    "isRecorded": true
  },
  {
    "time": "03:14",
    "seconds": 194,
    "speaker": "Karl Ravech",
    "text": "It is massive out there.",
    "isRecorded": true
  },
  {
    "time": "03:16",
    "seconds": 196,
    "speaker": "Karl Ravech",
    "text": "That ball was up there forever off the bat of Geller, and showing if I couldn't get to it.",
    "isRecorded": true
  },
  {
    "time": "03:21",
    "seconds": 201,
    "speaker": "Karl Ravech",
    "text": "But again, it was the two errors that led to the two guys on, which led to the two runs.",
    "isRecorded": true
  },
  {
    "time": "03:27",
    "seconds": 207,
    "speaker": "Karl Ravech",
    "text": "You play a clan game and you're from your West Virginia and save and get this group fired up.",
    "isRecorded": true
  },
  {
    "time": "03:32",
    "seconds": 212,
    "speaker": "Karl Ravech",
    "text": "And they've overachieved, maybe I think they're achieving to their level, because they're damn good players.",
    "isRecorded": true
  },
  {
    "time": "03:38",
    "seconds": 218,
    "speaker": "Karl Ravech",
    "text": "They play great defense.",
    "isRecorded": true
  },
  {
    "time": "03:40",
    "seconds": 220,
    "speaker": "Karl Ravech",
    "text": "Hall is so good at 30 was such an aberration.",
    "isRecorded": true
  },
  {
    "time": "03:42",
    "seconds": 222,
    "speaker": "Karl Ravech",
    "text": "Double play ball, maybe you rush it a little bit.",
    "isRecorded": true
  },
  {
    "time": "03:45",
    "seconds": 225,
    "speaker": "Karl Ravech",
    "text": "All the things that that you touched on and started to experience, we've been experiencing for 20 years.",
    "isRecorded": true
  },
  {
    "time": "03:52",
    "seconds": 232,
    "speaker": "Karl Ravech",
    "text": "And yes, the quality of the game and the field is only getting better.",
    "isRecorded": true
  },
  {
    "time": "03:57",
    "seconds": 237,
    "speaker": "Karl Ravech",
    "text": "Only Caroline has been here the last three years twice.",
    "isRecorded": true
  },
  {
    "time": "04:00",
    "seconds": 240,
    "speaker": "Karl Ravech",
    "text": "Other than that, you've got 23 new teams over the last three years.",
    "isRecorded": true
  },
  {
    "time": "04:04",
    "seconds": 244,
    "speaker": "Karl Ravech",
    "text": "Very few championships can say that.",
    "isRecorded": true
  },
  {
    "time": "04:07",
    "seconds": 247,
    "speaker": "Karl Ravech",
    "text": "Unbelievable.",
    "isRecorded": true
  },
  {
    "time": "04:07",
    "seconds": 247,
    "speaker": "Karl Ravech",
    "text": "Go ahead, AJ.",
    "isRecorded": true
  },
  {
    "time": "04:09",
    "seconds": 249,
    "speaker": "Karl Ravech",
    "text": "Yeah, Ravi, can you tell us a little bit about some of the stars that are playing the tournament right now that we might get to watch sometime in the near future",
    "isRecorded": true
  },
  {
    "time": "04:16",
    "seconds": 256,
    "speaker": "Karl Ravech",
    "text": "playing in the Major League?",
    "isRecorded": true
  },
  {
    "time": "04:18",
    "seconds": 258,
    "speaker": "Karl Ravech",
    "text": "Yeah, for sure.",
    "isRecorded": true
  },
  {
    "time": "04:18",
    "seconds": 258,
    "speaker": "Karl Ravech",
    "text": "So you guys talked about Joey Voltzko from Georgia, who through the other night, 15 strikeouts through a slider from hell.",
    "isRecorded": true
  },
  {
    "time": "04:26",
    "seconds": 266,
    "speaker": "Karl Ravech",
    "text": "Couldn't get anybody to go to a good piece of metal or aluminum on it.",
    "isRecorded": true
  },
  {
    "time": "04:31",
    "seconds": 271,
    "speaker": "Karl Ravech",
    "text": "So he comes in, Kylie McDaniel is one of our draft experts.",
    "isRecorded": true
  },
  {
    "time": "04:34",
    "seconds": 274,
    "speaker": "Karl Ravech",
    "text": "He's got him ranked, I think, as the number 27 guy here at the college world series, that's changing.",
    "isRecorded": true
  },
  {
    "time": "04:41",
    "seconds": 281,
    "speaker": "Karl Ravech",
    "text": "Like he's rising.",
    "isRecorded": true
  },
  {
    "time": "04:43",
    "seconds": 283,
    "speaker": "Karl Ravech",
    "text": "So there's been a whole bunch of history of guys that show up here.",
    "isRecorded": true
  },
  {
    "time": "04:47",
    "seconds": 287,
    "speaker": "Karl Ravech",
    "text": "That's your herd did it a few years ago.",
    "isRecorded": true
  },
  {
    "time": "04:49",
    "seconds": 289,
    "speaker": "Karl Ravech",
    "text": "As a pitcher, we saw a gauge wood for Arkansas last year, throw a no hitter, stock rises.",
    "isRecorded": true
  },
  {
    "time": "04:56",
    "seconds": 296,
    "speaker": "Karl Ravech",
    "text": "So A, you get here and you can be on a launching pad.",
    "isRecorded": true
  },
  {
    "time": "05:00",
    "seconds": 300,
    "speaker": "Karl Ravech",
    "text": "And then tonight, you're going to watch Georgia.",
    "isRecorded": true
  },
  {
    "time": "05:02",
    "seconds": 302,
    "speaker": "Karl Ravech",
    "text": "They got a catcher of Daniel Jackson who's who's sweeping all the postseason awards.",
    "isRecorded": true
  },
  {
    "time": "05:07",
    "seconds": 307,
    "speaker": "Karl Ravech",
    "text": "He's going to win the Golden Spikes award, which is equivalent to the high spending college football.",
    "isRecorded": true
  },
  {
    "time": "05:13",
    "seconds": 313,
    "speaker": "Karl Ravech",
    "text": "He's won the Buster Posey award because he plays catcher.",
    "isRecorded": true
  },
  {
    "time": "05:15",
    "seconds": 315,
    "speaker": "Karl Ravech",
    "text": "He's the best catcher.",
    "isRecorded": true
  },
  {
    "time": "05:17",
    "seconds": 317,
    "speaker": "Karl Ravech",
    "text": "Setting records will end up with a triple crown in the SEC, which is unheard of.",
    "isRecorded": true
  },
  {
    "time": "05:22",
    "seconds": 322,
    "speaker": "Karl Ravech",
    "text": "He'll be at the Major League level shortly.",
    "isRecorded": true
  },
  {
    "time": "05:25",
    "seconds": 325,
    "speaker": "Karl Ravech",
    "text": "There's a whole bunch, Aidan Robbins, who plays for Texas.",
    "isRecorded": true
  },
  {
    "time": "05:28",
    "seconds": 328,
    "speaker": "Karl Ravech",
    "text": "Kelly, who plays for West Virginia, all these dudes will be at the Major League level.",
    "isRecorded": true
  },
  {
    "time": "05:34",
    "seconds": 334,
    "speaker": "Karl Ravech",
    "text": "And guys, in AJ, you're seeing it happen much quicker.",
    "isRecorded": true
  },
  {
    "time": "05:37",
    "seconds": 337,
    "speaker": "Karl Ravech",
    "text": "Pat, you know this, JJ Weatherholt was playing for the mountaineers yesterday.",
    "isRecorded": true
  },
  {
    "time": "05:42",
    "seconds": 342,
    "speaker": "Karl Ravech",
    "text": "Now he's killing at the Major League level.",
    "isRecorded": true
  },
  {
    "time": "05:44",
    "seconds": 344,
    "speaker": "Karl Ravech",
    "text": "So a bunch of these guys will be there shortly.",
    "isRecorded": true
  },
  {
    "time": "05:46",
    "seconds": 346,
    "speaker": "Karl Ravech",
    "text": "Yeah, Skino, I think he was like four or five months removed from Omaha to Pittsburgh for the Pirates.",
    "isRecorded": true
  },
  {
    "time": "05:54",
    "seconds": 354,
    "speaker": "Karl Ravech",
    "text": "Young guys taken over, obviously, it's a young man's game, always going to be.",
    "isRecorded": true
  },
  {
    "time": "05:57",
    "seconds": 357,
    "speaker": "Karl Ravech",
    "text": "We ran into this guy in the hotel in the bathroom, actually.",
    "isRecorded": true
  },
  {
    "time": "06:01",
    "seconds": 361,
    "speaker": "Karl Ravech",
    "text": "And we're washing hands next to each other.",
    "isRecorded": true
  },
  {
    "time": "06:04",
    "seconds": 364,
    "speaker": "Karl Ravech",
    "text": "And he goes, hey, how you doing, Pat?",
    "isRecorded": true
  },
  {
    "time": "06:06",
    "seconds": 366,
    "speaker": "Karl Ravech",
    "text": "I go, great, man.",
    "isRecorded": true
  },
  {
    "time": "06:08",
    "seconds": 368,
    "speaker": "Karl Ravech",
    "text": "How are you doing?",
    "isRecorded": true
  },
  {
    "time": "06:08",
    "seconds": 368,
    "speaker": "Karl Ravech",
    "text": "Very tall, handsome, clearly in shape.",
    "isRecorded": true
  },
  {
    "time": "06:11",
    "seconds": 371,
    "speaker": "Karl Ravech",
    "text": "I had to be a baseball player of some sort.",
    "isRecorded": true
  },
  {
    "time": "06:14",
    "seconds": 374,
    "speaker": "Karl Ravech",
    "text": "I said, how do you do it?",
    "isRecorded": true
  },
  {
    "time": "06:15",
    "seconds": 375,
    "speaker": "Karl Ravech",
    "text": "He said, good, man.",
    "isRecorded": true
  },
  {
    "time": "06:17",
    "seconds": 377,
    "speaker": "Karl Ravech",
    "text": "I said, who do you play for?",
    "isRecorded": true
  },
  {
    "time": "06:18",
    "seconds": 378,
    "speaker": "Karl Ravech",
    "text": "He said, you and see.",
    "isRecorded": true
  },
  {
    "time": "06:19",
    "seconds": 379,
    "speaker": "Karl Ravech",
    "text": "I go, oh, he goes.",
    "isRecorded": true
  },
  {
    "time": "06:20",
    "seconds": 380,
    "speaker": "Karl Ravech",
    "text": "We're probably going to have to play your mountaineers or whatever.",
    "isRecorded": true
  },
  {
    "time": "06:22",
    "seconds": 382,
    "speaker": "Karl Ravech",
    "text": "I was like, you're going to get your ass kicked, so it doesn't matter.",
    "isRecorded": true
  },
  {
    "time": "06:24",
    "seconds": 384,
    "speaker": "Karl Ravech",
    "text": "You know, and he laughed obviously.",
    "isRecorded": true
  },
  {
    "time": "06:26",
    "seconds": 386,
    "speaker": "Karl Ravech",
    "text": "We walked outside and he was like, can I get a photo with you guys?",
    "isRecorded": true
  },
  {
    "time": "06:30",
    "seconds": 390,
    "speaker": "Karl Ravech",
    "text": "I was like, sure, man, no problem.",
    "isRecorded": true
  },
  {
    "time": "06:31",
    "seconds": 391,
    "speaker": "Karl Ravech",
    "text": "So we took a photo with him.",
    "isRecorded": true
  },
  {
    "time": "06:33",
    "seconds": 393,
    "speaker": "Karl Ravech",
    "text": "And I'm just looking at him.",
    "isRecorded": true
  },
  {
    "time": "06:34",
    "seconds": 394,
    "speaker": "Karl Ravech",
    "text": "I'm like, we should get a photo with this guy too, I think.",
    "isRecorded": true
  },
  {
    "time": "06:36",
    "seconds": 396,
    "speaker": "Karl Ravech",
    "text": "I think we should.",
    "isRecorded": true
  },
  {
    "time": "06:37",
    "seconds": 397,
    "speaker": "Karl Ravech",
    "text": "I didn't know who the fuck he was at the time.",
    "isRecorded": true
  },
  {
    "time": "06:39",
    "seconds": 399,
    "speaker": "Karl Ravech",
    "text": "I do not know college baseball.",
    "isRecorded": true
  },
  {
    "time": "06:41",
    "seconds": 401,
    "speaker": "Karl Ravech",
    "text": "I am open and I am sorry about that.",
    "isRecorded": true
  },
  {
    "time": "06:43",
    "seconds": 403,
    "speaker": "Karl Ravech",
    "text": "I'm only him because the mountaineers run.",
    "isRecorded": true
  },
  {
    "time": "06:44",
    "seconds": 404,
    "speaker": "Karl Ravech",
    "text": "I love that West Virginia is getting a shine.",
    "isRecorded": true
  },
  {
    "time": "06:46",
    "seconds": 406,
    "speaker": "Karl Ravech",
    "text": "I love what savings are amazing have created.",
    "isRecorded": true
  },
  {
    "time": "06:48",
    "seconds": 408,
    "speaker": "Karl Ravech",
    "text": "So I'm a supporter of that.",
    "isRecorded": true
  },
  {
    "time": "06:49",
    "seconds": 409,
    "speaker": "Karl Ravech",
    "text": "I don't know college baseball anywhere near as much as I should, but I think I'm trying to learn.",
    "isRecorded": true
  },
  {
    "time": "06:53",
    "seconds": 413,
    "speaker": "Karl Ravech",
    "text": "So we took a selfie with him.",
    "isRecorded": true
  },
  {
    "time": "06:55",
    "seconds": 415,
    "speaker": "Karl Ravech",
    "text": "And then you're entire, every package, UNC West Virginia package, everything was this guy.",
    "isRecorded": true
  },
  {
    "time": "07:01",
    "seconds": 421,
    "speaker": "Karl Ravech",
    "text": "Oh, and this is Owen Hall.",
    "isRecorded": true
  },
  {
    "time": "07:02",
    "seconds": 422,
    "speaker": "Karl Ravech",
    "text": "Center for Order, I believe for UNC.",
    "isRecorded": true
  },
  {
    "time": "07:04",
    "seconds": 424,
    "speaker": "Karl Ravech",
    "text": "He's the what?",
    "isRecorded": true
  },
  {
    "time": "07:05",
    "seconds": 425,
    "speaker": "Karl Ravech",
    "text": "This is like the one for them, right?",
    "isRecorded": true
  },
  {
    "time": "07:07",
    "seconds": 427,
    "speaker": "Karl Ravech",
    "text": "I learned that through the video packages like, wait, let's see what Owen does.",
    "isRecorded": true
  },
  {
    "time": "07:11",
    "seconds": 431,
    "speaker": "Karl Ravech",
    "text": "I'm like, fuck, I should have definitely known who this guy was, but he looked at picture.",
    "isRecorded": true
  },
  {
    "time": "07:16",
    "seconds": 436,
    "speaker": "Karl Ravech",
    "text": "He looks the part.",
    "isRecorded": true
  },
  {
    "time": "07:17",
    "seconds": 437,
    "speaker": "Karl Ravech",
    "text": "Like he certainly looks the part in it all.",
    "isRecorded": true
  },
  {
    "time": "07:20",
    "seconds": 440,
    "speaker": "Karl Ravech",
    "text": "He's going to be a guy too, right?",
    "isRecorded": true
  },
  {
    "time": "07:21",
    "seconds": 441,
    "speaker": "Karl Ravech",
    "text": "He's going to the show.",
    "isRecorded": true
  },
  {
    "time": "07:22",
    "seconds": 442,
    "speaker": "Karl Ravech",
    "text": "Oh, he's absolutely going to the show.",
    "isRecorded": true
  },
  {
    "time": "07:24",
    "seconds": 444,
    "speaker": "Karl Ravech",
    "text": "And he's one of those guys in every sport.",
    "isRecorded": true
  },
  {
    "time": "07:26",
    "seconds": 446,
    "speaker": "Karl Ravech",
    "text": "And you certainly see it with football and quarterbacks, especially guys slow the game down.",
    "isRecorded": true
  },
  {
    "time": "07:32",
    "seconds": 452,
    "speaker": "Karl Ravech",
    "text": "Oh, and Hall's, I don't think the heart beats.",
    "isRecorded": true
  },
  {
    "time": "07:34",
    "seconds": 454,
    "speaker": "Karl Ravech",
    "text": "I mean, I don't.",
    "isRecorded": true
  },
  {
    "time": "07:35",
    "seconds": 455,
    "speaker": "Karl Ravech",
    "text": "I think he got up it last night and just sort of flicked one in the left field.",
    "isRecorded": true
  },
  {
    "time": "07:39",
    "seconds": 459,
    "speaker": "Karl Ravech",
    "text": "He had four doubles in the super regional clinching game, including the walk-off, he's the guy that comes up with the big hits.",
    "isRecorded": true
  },
  {
    "time": "07:47",
    "seconds": 467,
    "speaker": "Karl Ravech",
    "text": "And there are certain dudes that you know belong at the next level.",
    "isRecorded": true
  },
  {
    "time": "07:52",
    "seconds": 472,
    "speaker": "Karl Ravech",
    "text": "Owen Hall is absolutely one of those guys.",
    "isRecorded": true
  },
  {
    "time": "07:54",
    "seconds": 474,
    "speaker": "Karl Ravech",
    "text": "Gavin Kelly of West Virginia is one of those guys.",
    "isRecorded": true
  },
  {
    "time": "07:58",
    "seconds": 478,
    "speaker": "Karl Ravech",
    "text": "They just look better.",
    "isRecorded": true
  },
  {
    "time": "08:00",
    "seconds": 480,
    "speaker": "Karl Ravech",
    "text": "They feel better.",
    "isRecorded": true
  },
  {
    "time": "08:01",
    "seconds": 481,
    "speaker": "Karl Ravech",
    "text": "You watch them play the game.",
    "isRecorded": true
  },
  {
    "time": "08:03",
    "seconds": 483,
    "speaker": "Karl Ravech",
    "text": "There's there's a real sort of low slow heartbeat.",
    "isRecorded": true
  },
  {
    "time": "08:07",
    "seconds": 487,
    "speaker": "Karl Ravech",
    "text": "Like, and then there's a guy like Kenny Ishikawa, who will hit fifth for Georgia.",
    "isRecorded": true
  },
  {
    "time": "08:12",
    "seconds": 492,
    "speaker": "Karl Ravech",
    "text": "You need a bat on a ball.",
    "isRecorded": true
  },
  {
    "time": "08:14",
    "seconds": 494,
    "speaker": "Karl Ravech",
    "text": "He'll do it for you.",
    "isRecorded": true
  },
  {
    "time": "08:15",
    "seconds": 495,
    "speaker": "Karl Ravech",
    "text": "He gets overshadowed in a lineup that's hit 170 plus Homer's this season.",
    "isRecorded": true
  },
  {
    "time": "08:22",
    "seconds": 502,
    "speaker": "Karl Ravech",
    "text": "And all he does is hit in the middle of the order.",
    "isRecorded": true
  },
  {
    "time": "08:24",
    "seconds": 504,
    "speaker": "Karl Ravech",
    "text": "And if you need run scored, he does it.",
    "isRecorded": true
  },
  {
    "time": "08:26",
    "seconds": 506,
    "speaker": "Karl Ravech",
    "text": "Save that picture.",
    "isRecorded": true
  },
  {
    "time": "08:27",
    "seconds": 507,
    "speaker": "Karl Ravech",
    "text": "Owen Hall will be an absolute first round pick.",
    "isRecorded": true
  },
  {
    "time": "08:29",
    "seconds": 509,
    "speaker": "Karl Ravech",
    "text": "He is a stud.",
    "isRecorded": true
  },
  {
    "time": "08:31",
    "seconds": 511,
    "speaker": "Karl Ravech",
    "text": "That was just strictly off of the vibes.",
    "isRecorded": true
  },
  {
    "time": "08:33",
    "seconds": 513,
    "speaker": "Karl Ravech",
    "text": "Just strictly off of looking at him.",
    "isRecorded": true
  },
  {
    "time": "08:35",
    "seconds": 515,
    "speaker": "Karl Ravech",
    "text": "The vibes he get.",
    "isRecorded": true
  },
  {
    "time": "08:36",
    "seconds": 516,
    "speaker": "Karl Ravech",
    "text": "This guy's super confident.",
    "isRecorded": true
  },
  {
    "time": "08:37",
    "seconds": 517,
    "speaker": "Karl Ravech",
    "text": "I mean, this is an eagle scout.",
    "isRecorded": true
  },
  {
    "time": "08:39",
    "seconds": 519,
    "speaker": "Karl Ravech",
    "text": "That eagle scout to black belt and in teaser black belt.",
    "isRecorded": true
  },
  {
    "time": "08:43",
    "seconds": 523,
    "speaker": "Karl Ravech",
    "text": "Black belt and Taekwondo.",
    "isRecorded": true
  },
  {
    "time": "08:44",
    "seconds": 524,
    "speaker": "Karl Ravech",
    "text": "Both his folks are involved with it.",
    "isRecorded": true
  },
  {
    "time": "08:45",
    "seconds": 525,
    "speaker": "Karl Ravech",
    "text": "Like literally the guy and we all go up with a dude who's when you said you remember like the best athlete in your school ever.",
    "isRecorded": true
  },
  {
    "time": "08:51",
    "seconds": 531,
    "speaker": "Karl Ravech",
    "text": "And I think like, oh yeah, Jimmy and Sokka was that guy.",
    "isRecorded": true
  },
  {
    "time": "08:54",
    "seconds": 534,
    "speaker": "Karl Ravech",
    "text": "Like irritatingly good at everything.",
    "isRecorded": true
  },
  {
    "time": "08:56",
    "seconds": 536,
    "speaker": "Karl Ravech",
    "text": "Owen Hall was the kid that was great at everything and still is.",
    "isRecorded": true
  },
  {
    "time": "09:00",
    "seconds": 540,
    "speaker": "Karl Ravech",
    "text": "I love that Jimmy just got a shout out to the conversation.",
    "isRecorded": true
  },
  {
    "time": "09:02",
    "seconds": 542,
    "speaker": "Karl Ravech",
    "text": "He really did some shit.",
    "isRecorded": true
  },
  {
    "time": "09:04",
    "seconds": 544,
    "speaker": "Karl Ravech",
    "text": "I think about him and crap.",
    "isRecorded": true
  },
  {
    "time": "09:06",
    "seconds": 546,
    "speaker": "Karl Ravech",
    "text": "Ravi, look at this guy.",
    "isRecorded": true
  },
  {
    "time": "09:07",
    "seconds": 547,
    "speaker": "Karl Ravech",
    "text": "Oh, of course.",
    "isRecorded": true
  },
  {
    "time": "09:08",
    "seconds": 548,
    "speaker": "Karl Ravech",
    "text": "My man.",
    "isRecorded": true
  },
  {
    "time": "09:09",
    "seconds": 549,
    "speaker": "Karl Ravech",
    "text": "Just remember.",
    "isRecorded": true
  },
  {
    "time": "09:10",
    "seconds": 550,
    "speaker": "Karl Ravech",
    "text": "But yeah, literally had no idea.",
    "isRecorded": true
  },
  {
    "time": "09:12",
    "seconds": 552,
    "speaker": "Karl Ravech",
    "text": "Strictly, yeah, obviously he's a black belt.",
    "isRecorded": true
  },
  {
    "time": "09:14",
    "seconds": 554,
    "speaker": "Karl Ravech",
    "text": "Obviously he's good at everything.",
    "isRecorded": true
  },
  {
    "time": "09:15",
    "seconds": 555,
    "speaker": "Karl Ravech",
    "text": "I mean, you can feel it whenever he was just standing there.",
    "isRecorded": true
  },
  {
    "time": "09:18",
    "seconds": 558,
    "speaker": "Karl Ravech",
    "text": "It just kind of radiated from him.",
    "isRecorded": true
  },
  {
    "time": "09:20",
    "seconds": 560,
    "speaker": "Karl Ravech",
    "text": "Man, Owen, hey, hey, what you did to the mountaineers.",
    "isRecorded": true
  },
  {
    "time": "09:24",
    "seconds": 564,
    "speaker": "Karl Ravech",
    "text": "Love that we got a photo and got to meet you in a bathroom.",
    "isRecorded": true
  },
  {
    "time": "09:26",
    "seconds": 566,
    "speaker": "Karl Ravech",
    "text": "Not weird at all.",
    "isRecorded": true
  },
  {
    "time": "09:27",
    "seconds": 567,
    "speaker": "Karl Ravech",
    "text": "Not weird at all.",
    "isRecorded": true
  },
  {
    "time": "09:28",
    "seconds": 568,
    "speaker": "Karl Ravech",
    "text": "I appreciate this.",
    "isRecorded": true
  },
  {
    "time": "09:29",
    "seconds": 569,
    "speaker": "Karl Ravech",
    "text": "Ty is question free, Ravi.",
    "isRecorded": true
  },
  {
    "time": "09:30",
    "seconds": 570,
    "speaker": "Karl Ravech",
    "text": "Ravi, obviously Georgia North Carolina have a pretty good grasp on this thing so far.",
    "isRecorded": true
  },
  {
    "time": "09:35",
    "seconds": 575,
    "speaker": "Karl Ravech",
    "text": "But of all the one lost teams that are remaining, which one do you think could make this very interesting and potentially kind of push to get into that final series?",
    "isRecorded": true
  },
  {
    "time": "09:45",
    "seconds": 585,
    "speaker": "Karl Ravech",
    "text": "Yeah, I mean, look, I really do love the West Virginia story.",
    "isRecorded": true
  },
  {
    "time": "09:49",
    "seconds": 589,
    "speaker": "Karl Ravech",
    "text": "I love everything about savings.",
    "isRecorded": true
  },
  {
    "time": "09:50",
    "seconds": 590,
    "speaker": "Karl Ravech",
    "text": "I would think that I would take Texas.",
    "isRecorded": true
  },
  {
    "time": "09:54",
    "seconds": 594,
    "speaker": "Karl Ravech",
    "text": "I saw them a lot this year.",
    "isRecorded": true
  },
  {
    "time": "09:57",
    "seconds": 597,
    "speaker": "Karl Ravech",
    "text": "The last two starts that Dylan Volantis, who arguably is the best picture.",
    "isRecorded": true
  },
  {
    "time": "10:02",
    "seconds": 602,
    "speaker": "Karl Ravech",
    "text": "And he's coming back next year.",
    "isRecorded": true
  },
  {
    "time": "10:03",
    "seconds": 603,
    "speaker": "Karl Ravech",
    "text": "He's still young.",
    "isRecorded": true
  },
  {
    "time": "10:04",
    "seconds": 604,
    "speaker": "Karl Ravech",
    "text": "He's not draft eligible.",
    "isRecorded": true
  },
  {
    "time": "10:06",
    "seconds": 606,
    "speaker": "Karl Ravech",
    "text": "He's had a couple of bumpy starts.",
    "isRecorded": true
  },
  {
    "time": "10:08",
    "seconds": 608,
    "speaker": "Karl Ravech",
    "text": "I think if any team with the depth of their offense, we haven't seen Sam Koser, who is a bear of a freshman,",
    "isRecorded": true
  },
  {
    "time": "10:17",
    "seconds": 617,
    "speaker": "Karl Ravech",
    "text": "literally like, you know, six, four, two, seven D brother plays at the next level.",
    "isRecorded": true
  },
  {
    "time": "10:24",
    "seconds": 624,
    "speaker": "Karl Ravech",
    "text": "I think it's Texas.",
    "isRecorded": true
  },
  {
    "time": "10:26",
    "seconds": 626,
    "speaker": "Karl Ravech",
    "text": "And you talk about the top three in their lineup.",
    "isRecorded": true
  },
  {
    "time": "10:29",
    "seconds": 629,
    "speaker": "Karl Ravech",
    "text": "They have Aidan Robbins, who's an absolute major league baseball player.",
    "isRecorded": true
  },
  {
    "time": "10:33",
    "seconds": 633,
    "speaker": "Karl Ravech",
    "text": "He minds a lot of people, the Chris Taylor, the very first little guy played for the Dodgers for a long time.",
    "isRecorded": true
  },
  {
    "time": "10:38",
    "seconds": 638,
    "speaker": "Karl Ravech",
    "text": "And Carson Tinney is one of the catcher's that's in this year's draft, a long line of catcher's, they're going to impact the major leagues at the next level.",
    "isRecorded": true
  },
  {
    "time": "10:46",
    "seconds": 646,
    "speaker": "Karl Ravech",
    "text": "Just a stud, especially offensively.",
    "isRecorded": true
  },
  {
    "time": "10:49",
    "seconds": 649,
    "speaker": "Karl Ravech",
    "text": "And then Anthony packed yours a freshman.",
    "isRecorded": true
  },
  {
    "time": "10:51",
    "seconds": 651,
    "speaker": "Karl Ravech",
    "text": "Like, we've saw it.",
    "isRecorded": true
  },
  {
    "time": "10:52",
    "seconds": 652,
    "speaker": "Karl Ravech",
    "text": "And you guys know this, but you watched the game last night.",
    "isRecorded": true
  },
  {
    "time": "10:54",
    "seconds": 654,
    "speaker": "Karl Ravech",
    "text": "Caden Blobber, who closed the game, should be a high school senior.",
    "isRecorded": true
  },
  {
    "time": "10:59",
    "seconds": 659,
    "speaker": "Karl Ravech",
    "text": "He should be a high school senior just graduating, going on senior trip.",
    "isRecorded": true
  },
  {
    "time": "11:03",
    "seconds": 663,
    "speaker": "Karl Ravech",
    "text": "And he is as composed as anybody that's thrown a baseball on this field.",
    "isRecorded": true
  },
  {
    "time": "11:08",
    "seconds": 668,
    "speaker": "Karl Ravech",
    "text": "And he's like 17 years old.",
    "isRecorded": true
  },
  {
    "time": "11:10",
    "seconds": 670,
    "speaker": "Karl Ravech",
    "text": "I didn't know he was 17.",
    "isRecorded": true
  },
  {
    "time": "11:12",
    "seconds": 672,
    "speaker": "Karl Ravech",
    "text": "I knew he was a true freshman.",
    "isRecorded": true
  },
  {
    "time": "11:13",
    "seconds": 673,
    "speaker": "Karl Ravech",
    "text": "I thought to myself, what a bunch of idiots.",
    "isRecorded": true
  },
  {
    "time": "11:16",
    "seconds": 676,
    "speaker": "Karl Ravech",
    "text": "They put a true freshman out here in the ninth inning.",
    "isRecorded": true
  },
  {
    "time": "11:19",
    "seconds": 679,
    "speaker": "Karl Ravech",
    "text": "We're not out of this.",
    "isRecorded": true
  },
  {
    "time": "11:20",
    "seconds": 680,
    "speaker": "Karl Ravech",
    "text": "We got we got home run.",
    "isRecorded": true
  },
  {
    "time": "11:21",
    "seconds": 681,
    "speaker": "Karl Ravech",
    "text": "We tie this thing up.",
    "isRecorded": true
  },
  {
    "time": "11:22",
    "seconds": 682,
    "speaker": "Karl Ravech",
    "text": "This is what the mountaineers have done.",
    "isRecorded": true
  },
  {
    "time": "11:24",
    "seconds": 684,
    "speaker": "Karl Ravech",
    "text": "They put a freshman out there in my head.",
    "isRecorded": true
  },
  {
    "time": "11:25",
    "seconds": 685,
    "speaker": "Karl Ravech",
    "text": "I'm like, savings are spitting in your face right now in your team culture.",
    "isRecorded": true
  },
  {
    "time": "11:28",
    "seconds": 688,
    "speaker": "Karl Ravech",
    "text": "Then he gets up there.",
    "isRecorded": true
  },
  {
    "time": "11:30",
    "seconds": 690,
    "speaker": "Karl Ravech",
    "text": "Yeah, right.",
    "isRecorded": true
  },
  {
    "time": "11:31",
    "seconds": 691,
    "speaker": "Karl Ravech",
    "text": "This kid 17 thrown 97 in the same exact same exact spot.",
    "isRecorded": true
  },
  {
    "time": "11:36",
    "seconds": 696,
    "speaker": "Karl Ravech",
    "text": "I mean, he's scary, man.",
    "isRecorded": true
  },
  {
    "time": "11:38",
    "seconds": 698,
    "speaker": "Karl Ravech",
    "text": "He's scary.",
    "isRecorded": true
  },
  {
    "time": "11:39",
    "seconds": 699,
    "speaker": "Karl Ravech",
    "text": "The other point was Anthony Pack, who plays for Texas plays left.",
    "isRecorded": true
  },
  {
    "time": "11:42",
    "seconds": 702,
    "speaker": "Karl Ravech",
    "text": "He'll hit third is a freshman.",
    "isRecorded": true
  },
  {
    "time": "11:44",
    "seconds": 704,
    "speaker": "Karl Ravech",
    "text": "He hits in the middle of the order.",
    "isRecorded": true
  },
  {
    "time": "11:45",
    "seconds": 705,
    "speaker": "Karl Ravech",
    "text": "I had the best batting average of any player in the SEC.",
    "isRecorded": true
  },
  {
    "time": "11:48",
    "seconds": 708,
    "speaker": "Karl Ravech",
    "text": "And he's a freshman.",
    "isRecorded": true
  },
  {
    "time": "11:49",
    "seconds": 709,
    "speaker": "Karl Ravech",
    "text": "That's the point about whether or not he's other guys.",
    "isRecorded": true
  },
  {
    "time": "11:52",
    "seconds": 712,
    "speaker": "Karl Ravech",
    "text": "It's not only that you graduate college or leave as a junior and get drafted and make an impact, kids are leaving high school, some leaving early and make an impact in the best conference",
    "isRecorded": true
  },
  {
    "time": "12:03",
    "seconds": 723,
    "speaker": "Karl Ravech",
    "text": "that there is in college baseball.",
    "isRecorded": true
  },
  {
    "time": "12:07",
    "seconds": 727,
    "speaker": "Karl Ravech",
    "text": "Like Duffy kid or something is last.",
    "isRecorded": true
  },
  {
    "time": "12:10",
    "seconds": 730,
    "speaker": "Karl Ravech",
    "text": "Would you guys check for AI in there?",
    "isRecorded": true
  },
  {
    "time": "12:12",
    "seconds": 732,
    "speaker": "Karl Ravech",
    "text": "Did you check for any of those?",
    "isRecorded": true
  },
  {
    "time": "12:14",
    "seconds": 734,
    "speaker": "Karl Ravech",
    "text": "Because, you know, they got these glasses of AI right now.",
    "isRecorded": true
  },
  {
    "time": "12:16",
    "seconds": 736,
    "speaker": "Karl Ravech",
    "text": "Metas actually giving them to all the blind vets.",
    "isRecorded": true
  },
  {
    "time": "12:19",
    "seconds": 739,
    "speaker": "Karl Ravech",
    "text": "Yeah.",
    "isRecorded": true
  },
  {
    "time": "12:20",
    "seconds": 740,
    "speaker": "Karl Ravech",
    "text": "Have you heard about this?",
    "isRecorded": true
  },
  {
    "time": "12:21",
    "seconds": 741,
    "speaker": "Karl Ravech",
    "text": "Congratulations.",
    "isRecorded": true
  },
  {
    "time": "12:22",
    "seconds": 742,
    "speaker": "Karl Ravech",
    "text": "UFC and meta.",
    "isRecorded": true
  },
  {
    "time": "12:23",
    "seconds": 743,
    "speaker": "Karl Ravech",
    "text": "I believe they're donating AI glasses to blind veterans.",
    "isRecorded": true
  },
  {
    "time": "12:28",
    "seconds": 748,
    "speaker": "Karl Ravech",
    "text": "I do believe.",
    "isRecorded": true
  },
  {
    "time": "12:29",
    "seconds": 749,
    "speaker": "Karl Ravech",
    "text": "So they have this technology.",
    "isRecorded": true
  },
  {
    "time": "12:30",
    "seconds": 750,
    "speaker": "Karl Ravech",
    "text": "This kid's a lot of wear AI on his face while he's out there pitching.",
    "isRecorded": true
  },
  {
    "time": "12:34",
    "seconds": 754,
    "speaker": "Karl Ravech",
    "text": "Is this getting checked?",
    "isRecorded": true
  },
  {
    "time": "12:35",
    "seconds": 755,
    "speaker": "Karl Ravech",
    "text": "He was unbelievable.",
    "isRecorded": true
  },
  {
    "time": "12:36",
    "seconds": 756,
    "speaker": "Karl Ravech",
    "text": "He had the ball on a string.",
    "isRecorded": true
  },
  {
    "time": "12:38",
    "seconds": 758,
    "speaker": "Karl Ravech",
    "text": "Actually, had the ball on a string the entire night watching him.",
    "isRecorded": true
  },
  {
    "time": "12:40",
    "seconds": 760,
    "speaker": "Karl Ravech",
    "text": "I think he should not be allowed to wear those.",
    "isRecorded": true
  },
  {
    "time": "12:43",
    "seconds": 763,
    "speaker": "Karl Ravech",
    "text": "I think we got to check those with the modern technology, Ravi.",
    "isRecorded": true
  },
  {
    "time": "12:47",
    "seconds": 767,
    "speaker": "Karl Ravech",
    "text": "It's the reverse.",
    "isRecorded": true
  },
  {
    "time": "12:48",
    "seconds": 768,
    "speaker": "Karl Ravech",
    "text": "It's the reverse Steve.",
    "isRecorded": true
  },
  {
    "time": "12:49",
    "seconds": 769,
    "speaker": "Karl Ravech",
    "text": "I'll say, remember the six million dollar man.",
    "isRecorded": true
  },
  {
    "time": "12:51",
    "seconds": 771,
    "speaker": "Karl Ravech",
    "text": "You know, he could sort of see through some fake eye that he had.",
    "isRecorded": true
  },
  {
    "time": "12:54",
    "seconds": 774,
    "speaker": "Karl Ravech",
    "text": "Yeah, maybe that works for him.",
    "isRecorded": true
  },
  {
    "time": "12:55",
    "seconds": 775,
    "speaker": "Karl Ravech",
    "text": "I will say this.",
    "isRecorded": true
  },
  {
    "time": "12:56",
    "seconds": 776,
    "speaker": "Karl Ravech",
    "text": "He was a shortstop in high school.",
    "isRecorded": true
  },
  {
    "time": "12:58",
    "seconds": 778,
    "speaker": "Karl Ravech",
    "text": "He tore his ACL.",
    "isRecorded": true
  },
  {
    "time": "12:59",
    "seconds": 779,
    "speaker": "Karl Ravech",
    "text": "Decided, you know what?",
    "isRecorded": true
  },
  {
    "time": "13:00",
    "seconds": 780,
    "speaker": "Karl Ravech",
    "text": "I'm going to go to the mound and he turns out throwing baseballs like this.",
    "isRecorded": true
  },
  {
    "time": "13:05",
    "seconds": 785,
    "speaker": "Karl Ravech",
    "text": "This is why Carolina is one of the teams that a lot of people look at us and one that's going to get to the college world series finals.",
    "isRecorded": true
  },
  {
    "time": "13:12",
    "seconds": 792,
    "speaker": "Karl Ravech",
    "text": "That and the fact that the Texas and Georgia are on the same side of the bracket and Carolina is not.",
    "isRecorded": true
  },
  {
    "time": "13:18",
    "seconds": 798,
    "speaker": "Karl Ravech",
    "text": "They have three great pitchers.",
    "isRecorded": true
  },
  {
    "time": "13:20",
    "seconds": 800,
    "speaker": "Karl Ravech",
    "text": "So like your boy, Glauber, may end up starting their next game to get them into the finals.",
    "isRecorded": true
  },
  {
    "time": "13:24",
    "seconds": 804,
    "speaker": "Karl Ravech",
    "text": "Or they decide, you know what?",
    "isRecorded": true
  },
  {
    "time": "13:26",
    "seconds": 806,
    "speaker": "Karl Ravech",
    "text": "If we can win the next game, we could start him in game one of the finals, which would be a big advantage to go with the other dudes they have.",
    "isRecorded": true
  },
  {
    "time": "13:32",
    "seconds": 812,
    "speaker": "Karl Ravech",
    "text": "Let's see who they're playing.",
    "isRecorded": true
  },
  {
    "time": "13:34",
    "seconds": 814,
    "speaker": "Karl Ravech",
    "text": "Let's see.",
    "isRecorded": true
  },
  {
    "time": "13:35",
    "seconds": 815,
    "speaker": "Karl Ravech",
    "text": "Troy just knocked out Ole Miss.",
    "isRecorded": true
  },
  {
    "time": "13:36",
    "seconds": 816,
    "speaker": "Karl Ravech",
    "text": "I heard that wasn't supposed to happen.",
    "isRecorded": true
  },
  {
    "time": "13:38",
    "seconds": 818,
    "speaker": "Karl Ravech",
    "text": "I heard that was not supposed to happen.",
    "isRecorded": true
  },
  {
    "time": "13:40",
    "seconds": 820,
    "speaker": "Karl Ravech",
    "text": "In West Virginia, for the first time, long time, got punched right in the mouth with her own mistakes.",
    "isRecorded": true
  },
  {
    "time": "13:45",
    "seconds": 825,
    "speaker": "Karl Ravech",
    "text": "Yeah.",
    "isRecorded": true
  },
  {
    "time": "13:46",
    "seconds": 826,
    "speaker": "Karl Ravech",
    "text": "Let's see how they respond.",
    "isRecorded": true
  },
  {
    "time": "13:47",
    "seconds": 827,
    "speaker": "Karl Ravech",
    "text": "Maisie said he wants blue collar boys only, right?",
    "isRecorded": true
  },
  {
    "time": "13:49",
    "seconds": 829,
    "speaker": "Karl Ravech",
    "text": "See, that's tough guys, right?",
    "isRecorded": true
  },
  {
    "time": "13:50",
    "seconds": 830,
    "speaker": "Karl Ravech",
    "text": "Let's see if they're mentally tough.",
    "isRecorded": true
  },
  {
    "time": "13:51",
    "seconds": 831,
    "speaker": "Karl Ravech",
    "text": "Or is the moment too big for him in their first trip to Omaha.",
    "isRecorded": true
  },
  {
    "time": "13:54",
    "seconds": 834,
    "speaker": "Karl Ravech",
    "text": "We shall see.",
    "isRecorded": true
  },
  {
    "time": "13:55",
    "seconds": 835,
    "speaker": "Karl Ravech",
    "text": "Ravi, we appreciate the hell out of you, man, for joining us.",
    "isRecorded": true
  },
  {
    "time": "13:57",
    "seconds": 837,
    "speaker": "Karl Ravech",
    "text": "And also for voicing over these magical moments from Omaha for so long.",
    "isRecorded": true
  },
  {
    "time": "14:01",
    "seconds": 841,
    "speaker": "Karl Ravech",
    "text": "We were very lucky to experience it.",
    "isRecorded": true
  },
  {
    "time": "14:02",
    "seconds": 842,
    "speaker": "Karl Ravech",
    "text": "We cannot wait to get back out there.",
    "isRecorded": true
  },
  {
    "time": "14:05",
    "seconds": 845,
    "speaker": "Karl Ravech",
    "text": "I can't wait to see you all out here.",
    "isRecorded": true
  },
  {
    "time": "14:07",
    "seconds": 847,
    "speaker": "Karl Ravech",
    "text": "Thanks very much for having me again.",
    "isRecorded": true
  },
  {
    "time": "14:08",
    "seconds": 848,
    "speaker": "Karl Ravech",
    "text": "Nice.",
    "isRecorded": true
  },
  {
    "time": "14:08",
    "seconds": 848,
    "speaker": "Karl Ravech",
    "text": "Thank you.",
    "isRecorded": true
  },
  {
    "time": "14:08",
    "seconds": 848,
    "speaker": "Karl Ravech",
    "text": "Did you move your microphone because at the beginning, you had a shadow on your mic that looked like you had a piece of black tape on your face.",
    "isRecorded": true
  },
  {
    "time": "14:16",
    "seconds": 856,
    "speaker": "Karl Ravech",
    "text": "Yeah, there it is.",
    "isRecorded": true
  },
  {
    "time": "14:16",
    "seconds": 856,
    "speaker": "Karl Ravech",
    "text": "Yeah, better.",
    "isRecorded": true
  },
  {
    "time": "14:17",
    "seconds": 857,
    "speaker": "Karl Ravech",
    "text": "Yep.",
    "isRecorded": true
  },
  {
    "time": "14:18",
    "seconds": 858,
    "speaker": "Karl Ravech",
    "text": "They're making a hide behind you.",
    "isRecorded": true
  },
  {
    "time": "14:19",
    "seconds": 859,
    "speaker": "Karl Ravech",
    "text": "Oh, that can neighbor in home improvement.",
    "isRecorded": true
  },
  {
    "time": "14:21",
    "seconds": 861,
    "speaker": "Karl Ravech",
    "text": "Wilson.",
    "isRecorded": true
  },
  {
    "time": "14:22",
    "seconds": 862,
    "speaker": "Karl Ravech",
    "text": "Wilson over there.",
    "isRecorded": true
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
    "text": "America's air traffic control system handles about 55,000 flights a day, but many of the busiest control towers still run on paper.",
    "isRecorded": true
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "News Anchor",
    "text": "These are called flight strips, and they are used by air traffic controllers to track airplanes as they move through different pieces of airspace,",
    "isRecorded": true
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "News Anchor",
    "text": "and they're physically handed from controller to controller.",
    "isRecorded": true
  },
  {
    "time": "00:21",
    "seconds": 21,
    "speaker": "News Anchor",
    "text": "It's a process that's been around for decades.",
    "isRecorded": true
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "News Anchor",
    "text": "It's just old.",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "News Anchor",
    "text": "We've been doing it for so many years, and there's a better way of doing it.",
    "isRecorded": true
  },
  {
    "time": "00:29",
    "seconds": 29,
    "speaker": "News Anchor",
    "text": "Now the Federal Aviation Administration wants to replace these paper strips with digital technology, part of a massive multi-billion dollar overhaul of the nation's aging air traffic control infrastructure.",
    "isRecorded": true
  },
  {
    "time": "00:40",
    "seconds": 40,
    "speaker": "News Anchor",
    "text": "Transportation Secretary Sean Duffy says he wants a massive expansion of this project by 2028.",
    "isRecorded": true
  },
  {
    "time": "00:47",
    "seconds": 47,
    "speaker": "News Anchor",
    "text": "Right now, this is only happening in about 17 different air traffic control facilities nationwide, and not everybody is on board with trashing paper for good.",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "News Anchor",
    "text": "I would definitely be very skeptical and would want to make sure that it does all the things that we can do with paper strips",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "News Anchor",
    "text": "and have the reliability that a paper strip and a pen will have.",
    "isRecorded": true
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
    "text": "But, Will, I want your take on what's happening here and what message he, but really ultimately this entire production was trying to send about our country in this particular",
    "isRecorded": true
  },
  {
    "time": "00:11",
    "seconds": 11,
    "speaker": "Ashley Parker",
    "text": "moment.",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Ashley Parker",
    "text": "Yeah.",
    "isRecorded": true
  },
  {
    "time": "00:13",
    "seconds": 13,
    "speaker": "Ashley Parker",
    "text": "I mean, viewers could see this sort of fake, hopefully fake vomit coming out as well.",
    "isRecorded": true
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Ashley Parker",
    "text": "I mean, I think I think it's very disturbing that this happened at the White House.",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "Ashley Parker",
    "text": "You know, one thing I should note here, we're now seeing people like Dana White, the head of UFC sort of trying to distance themselves from Josh Okits remarks, but he did something",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "Ashley Parker",
    "text": "very similar to this back in January, when he said that Brittany Greiner, again, another black woman, is transgender.",
    "isRecorded": true
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "Ashley Parker",
    "text": "And so when you put this guy on this massive stage, you know what's going to happen.",
    "isRecorded": true
  },
  {
    "time": "00:39",
    "seconds": 39,
    "speaker": "Ashley Parker",
    "text": "UFC controls these cards, presumably the White House controls who's going to fight as well.",
    "isRecorded": true
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "Ashley Parker",
    "text": "And, you know, I think you can hear the laughter when he makes that remark, the fact that the White House now has come out and not disowned him or anything.",
    "isRecorded": true
  },
  {
    "time": "00:51",
    "seconds": 51,
    "speaker": "Ashley Parker",
    "text": "I mean, I think it's really disturbing and I think it gets at this sort of ugly spectacle that this event was.",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "Ashley Parker",
    "text": "Actually, you know, a lot of people have compared this to gladiator, to the famous Roman",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "Ashley Parker",
    "text": "saying, bread and circus, I think it's interesting though at a time when so many Americans feel like they don't have the first key part of that phrase, which is at least the bread,",
    "isRecorded": true
  },
  {
    "time": "01:13",
    "seconds": 73,
    "speaker": "Ashley Parker",
    "text": "the basic sustenance, to feel kind of secure in your everyday life right now.",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "Ashley Parker",
    "text": "And I want to get your take on beyond just the aesthetics and the sort of cultural messaging of this.",
    "isRecorded": true
  },
  {
    "time": "01:26",
    "seconds": 86,
    "speaker": "Ashley Parker",
    "text": "But it means to have Americans struggling in the way we know that they are economically right now with these questions of corruption and self-dealing and enrichment coming out of",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "Ashley Parker",
    "text": "this Trump buying $50,000 worth of UFC stock in March, for example, last night's winners paid bonuses in cryptocurrency issued by Trump's crypto company.",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "Ashley Parker",
    "text": "The event sponsored by a company that is donated $35 million to $35 million to a Trump super-pack polymarket, which Trump Jr. is an unpaid advisor to, was a sponsor.",
    "isRecorded": true
  },
  {
    "time": "01:59",
    "seconds": 119,
    "speaker": "Ashley Parker",
    "text": "All these allegations of pay for access.",
    "isRecorded": true
  },
  {
    "time": "02:02",
    "seconds": 122,
    "speaker": "Ashley Parker",
    "text": "The event only viewable by a subscription service to drum roll, please, Paramount Plus.",
    "isRecorded": true
  },
  {
    "time": "02:09",
    "seconds": 129,
    "speaker": "Ashley Parker",
    "text": "We know all about the deals going on right now between the Elisans and the role that the Trump administration has to play in approving all of that.",
    "isRecorded": true
  },
  {
    "time": "02:17",
    "seconds": 137,
    "speaker": "Ashley Parker",
    "text": "Break it down for me.",
    "isRecorded": true
  },
  {
    "time": "02:19",
    "seconds": 139,
    "speaker": "Ashley Parker",
    "text": "Well, you've just laid it all out and, you know, putting aside that presidents invite figures of culture to the White House all the time.",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "Ashley Parker",
    "text": "Poets, playwrights, et cetera.",
    "isRecorded": true
  },
  {
    "time": "02:31",
    "seconds": 151,
    "speaker": "Ashley Parker",
    "text": "It is President Trump's right to choose who he has.",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "Ashley Parker",
    "text": "But again, as we just covered, it's worth noting that the sorts of people in the sorts of language and comments they made are those that should instantly be disowned.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "Ashley Parker",
    "text": "And you should not have come to a surprise to the president or his team because this is a guy who has made similarly racist and conspiracy theories comments previously.",
    "isRecorded": true
  },
  {
    "time": "02:54",
    "seconds": 174,
    "speaker": "Ashley Parker",
    "text": "Putting all of that aside, what Trump has not been able to get away with and what really upsets voters and what he might be able to get away with in a different moment is this",
    "isRecorded": true
  },
  {
    "time": "03:05",
    "seconds": 185,
    "speaker": "Ashley Parker",
    "text": "sense of grift and corruption and only caring about himself and his allies.",
    "isRecorded": true
  },
  {
    "time": "03:12",
    "seconds": 192,
    "speaker": "Ashley Parker",
    "text": "And if the bread part of bread and circus is you point out was being taken care of, there might be less outrage and I want to be clear not just from the left and not just from",
    "isRecorded": true
  },
  {
    "time": "03:20",
    "seconds": 200,
    "speaker": "Ashley Parker",
    "text": "Democrats, but you hear this from Republican voters who were part of that very broad coalition that helped realt Trump in 2024.",
    "isRecorded": true
  },
  {
    "time": "03:29",
    "seconds": 209,
    "speaker": "Ashley Parker",
    "text": "So you have this cage fight on the lawn of the White House.",
    "isRecorded": true
  },
  {
    "time": "03:33",
    "seconds": 213,
    "speaker": "Ashley Parker",
    "text": "You have the White House ballroom.",
    "isRecorded": true
  },
  {
    "time": "03:35",
    "seconds": 215,
    "speaker": "Ashley Parker",
    "text": "I cannot tell you how many times these things come up unprompted in focus groups because",
    "isRecorded": true
  },
  {
    "time": "03:40",
    "seconds": 220,
    "speaker": "Ashley Parker",
    "text": "they are sort of physical embodiments, gilded, angry embodiments of this idea that the president",
    "isRecorded": true
  },
  {
    "time": "03:48",
    "seconds": 228,
    "speaker": "Ashley Parker",
    "text": "does not care about the average American that he is not keeping his promises.",
    "isRecorded": true
  },
  {
    "time": "03:52",
    "seconds": 232,
    "speaker": "Ashley Parker",
    "text": "One of the key reasons he was elected was to lower costs, lower interest rates, make things more affordable, lower gas prices.",
    "isRecorded": true
  },
  {
    "time": "04:01",
    "seconds": 241,
    "speaker": "Ashley Parker",
    "text": "He doesn't care about them.",
    "isRecorded": true
  },
  {
    "time": "04:02",
    "seconds": 242,
    "speaker": "Ashley Parker",
    "text": "He's not keeping his promises and he only cares about these sort of monuments, physical and performative to himself.",
    "isRecorded": true
  },
  {
    "time": "04:10",
    "seconds": 250,
    "speaker": "Ashley Parker",
    "text": "Ashley Parker will summer great to see both of you and thank you for your work.",
    "isRecorded": true
  }
],
  "HPiqxMrKMKQ": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "People Host",
    "text": "I'm very pleased to say that she reached out of a text because she had my phone number because she was a producer of the film.",
    "isRecorded": true
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "People Host",
    "text": "I saw her for the first time personally on March the 3rd of last year with our first time to see each other.",
    "isRecorded": true
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "People Host",
    "text": "And she was like, man, everybody's coming to Tennessee.",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "People Host",
    "text": "I was like, yeah, man, everybody's coming to Tennessee.",
    "isRecorded": true
  },
  {
    "time": "00:23",
    "seconds": 23,
    "speaker": "People Host",
    "text": "It's the hot spot to film.",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "People Host",
    "text": "And so she came over to explore why Nashville is so happening.",
    "isRecorded": true
  },
  {
    "time": "00:31",
    "seconds": 31,
    "speaker": "People Host",
    "text": "She ended up staying.",
    "isRecorded": true
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "People Host",
    "text": "And then Lumba, then she told me it was my turn to go there.",
    "isRecorded": true
  },
  {
    "time": "00:37",
    "seconds": 37,
    "speaker": "People Host",
    "text": "I finally leave Williamson County for the first time of five years and go to the craziest thing I've ever done.",
    "isRecorded": true
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "People Host",
    "text": "But I had to do it like something just said, track in, track in.",
    "isRecorded": true
  },
  {
    "time": "00:52",
    "seconds": 52,
    "speaker": "People Host",
    "text": "Gosh, man.",
    "isRecorded": true
  },
  {
    "time": "00:53",
    "seconds": 53,
    "speaker": "People Host",
    "text": "OK, it feels like something real.",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "People Host",
    "text": "It feels like something real.",
    "isRecorded": true
  },
  {
    "time": "00:58",
    "seconds": 58,
    "speaker": "People Host",
    "text": "The first time we ever did not make it to London.",
    "isRecorded": true
  },
  {
    "time": "01:02",
    "seconds": 62,
    "speaker": "People Host",
    "text": "And I just got there and made it to her house.",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "People Host",
    "text": "And I was like, on the wrong time zone and everything.",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "People Host",
    "text": "And her and D-man said, hey, we've decided to go to Rome, to the big Valentino exhibit.",
    "isRecorded": true
  },
  {
    "time": "01:16",
    "seconds": 76,
    "speaker": "People Host",
    "text": "When's the car tomorrow?",
    "isRecorded": true
  },
  {
    "time": "01:18",
    "seconds": 78,
    "speaker": "People Host",
    "text": "What?",
    "isRecorded": true
  },
  {
    "time": "01:18",
    "seconds": 78,
    "speaker": "People Host",
    "text": "The next Santa, there we go.",
    "isRecorded": true
  },
  {
    "time": "01:20",
    "seconds": 80,
    "speaker": "People Host",
    "text": "And then we're getting out.",
    "isRecorded": true
  },
  {
    "time": "01:23",
    "seconds": 83,
    "speaker": "People Host",
    "text": "And then she's got on that pink dress.",
    "isRecorded": true
  },
  {
    "time": "01:26",
    "seconds": 86,
    "speaker": "People Host",
    "text": "I'm in all black.",
    "isRecorded": true
  },
  {
    "time": "01:27",
    "seconds": 87,
    "speaker": "People Host",
    "text": "There was something in the opposites of us.",
    "isRecorded": true
  },
  {
    "time": "01:31",
    "seconds": 91,
    "speaker": "People Host",
    "text": "I think that maybe not only got other people's attention, but maybe even got our own attention.",
    "isRecorded": true
  }
],
  "vwOxJJ80t3k": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "CNBC Reporter",
    "text": "KFC just announced some major news, bold new menu additions, a revamp of its restaurants and fresh branding. Right now, chicken is the hottest protein in fast food, and chains",
    "isRecorded": true
  },
  {
    "time": "00:11",
    "seconds": 11,
    "speaker": "CNBC Reporter",
    "text": "like Chick-fil-A, Popeyes, and raising canes are dominating the U.S. market.",
    "isRecorded": true
  },
  {
    "time": "00:17",
    "seconds": 17,
    "speaker": "CNBC Reporter",
    "text": "Even burger joints like McDonald's are using chicken to boost sales and traffic, and so this should be a major moment for KFC, which likes to say it made chicken famous.",
    "isRecorded": true
  },
  {
    "time": "00:27",
    "seconds": 27,
    "speaker": "CNBC Reporter",
    "text": "Yet, it's been left in the dust, at least domestically. It's now the fourth largest U.S.",
    "isRecorded": true
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "CNBC Reporter",
    "text": "chicken joint by market share. In 2025, the company launched a U.S. specific turnaround plan.",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "CNBC Reporter",
    "text": "KFC is part of a larger portfolio of fast food companies under young brands. The chains U.S. business now makes up less than 5% of young brands overall operating profits, and it's",
    "isRecorded": true
  },
  {
    "time": "00:48",
    "seconds": 48,
    "speaker": "CNBC Reporter",
    "text": "slipped to the third largest market by sales, falling behind China and Europe.",
    "isRecorded": true
  },
  {
    "time": "00:52",
    "seconds": 52,
    "speaker": "CNBC Reporter",
    "text": "Young is no longer sharing the same store sales for KFC's U.S. business. That basically means that the segment has become insignificant to the company's broader results.",
    "isRecorded": true
  },
  {
    "time": "01:02",
    "seconds": 62,
    "speaker": "CNBC Reporter",
    "text": "But KFC International is booming. It's become a mainstay in countries like China, Thailand, and South Africa. Offering local dishes and flavors have won over those consumers. And yet",
    "isRecorded": true
  },
  {
    "time": "01:12",
    "seconds": 72,
    "speaker": "CNBC Reporter",
    "text": "consumers across the world are generally favoring tenders and dipping sauces. KFC is still mainly known for its buckets of southern-style fried chicken. Despite claiming it",
    "isRecorded": true
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "CNBC Reporter",
    "text": "invented a tender, these big company updates are looking to change that, and spring KFC closer to its chicken piers. It's expanding its boneless menu items, including tenders and sauces.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "CNBC Reporter",
    "text": "It has innovated on beverages, with a lineup it's calling quenched by KFC.",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "CNBC Reporter",
    "text": "Drinks have become an important hedge against inflation for many, including McDonald's and Starbucks.",
    "isRecorded": true
  },
  {
    "time": "01:41",
    "seconds": 101,
    "speaker": "CNBC Reporter",
    "text": "Americans are increasingly heading to chains simply for an ice coffee or soda, and beverages carry significantly higher profit margins than food.",
    "isRecorded": true
  },
  {
    "time": "01:50",
    "seconds": 110,
    "speaker": "CNBC Reporter",
    "text": "The changes will roll out first in the UK and Ireland, followed by Australia and the U.S.",
    "isRecorded": true
  },
  {
    "time": "01:55",
    "seconds": 115,
    "speaker": "CNBC Reporter",
    "text": "Then the chain will open when it's calling a new generation of restaurants this summer, first in Texas, and then in Dubai. KFC's chief concept officer, Kristoff Poye,",
    "isRecorded": true
  },
  {
    "time": "02:05",
    "seconds": 125,
    "speaker": "CNBC Reporter",
    "text": "told me that the new restaurant design will be immersive and compared the experience to seeing a concert at the sphere. He said he's been inspired by the success of Taco Bell's live",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "CNBC Reporter",
    "text": "Moss cafes. Taco Bell is another brand under young brands. Whether this will help lift KFC sales remains to be seen. The cost of dining out has risen faster than eating at home,",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "CNBC Reporter",
    "text": "and U.S. consumers plan on eating out less and ordering cheaper or fewer items. Plus,",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "CNBC Reporter",
    "text": "competition is getting tougher by the day. More and more chicken concepts seem to pop up everywhere.",
    "isRecorded": true
  }
],
  "GRIMVmtwS6w": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "CNN Anchor",
    "text": "Do you share this fear that if left unchecked, AI \ncould kill everyone decade? Who knows? But this is crazy stuff. What I do know is that when you \nhave researchers and scientists and in fact the",
    "isRecorded": true
  },
  {
    "time": "00:17",
    "seconds": 17,
    "speaker": "CNN Anchor",
    "text": "leaders in the AI industry saying we are building \na dangerous technology, we don't know where it is going. We cannot control it. Duh. It is time for \nthe American people and their representatives",
    "isRecorded": true
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "CNN Anchor",
    "text": "into in Congress to say we are going to control \nit. I don't know whether it's a 10% chance that humanity will be wiped out or a 2% chance. It \ndoesn't matter. It is much too risky. Stop it",
    "isRecorded": true
  },
  {
    "time": "00:46",
    "seconds": 46,
    "speaker": "CNN Anchor",
    "text": "right now. And what we need immediately is a \nban on super intelligent AI. We need a pause on advanced AI so we don't continue down the path \nthat these guys are warning us uh about. Do you",
    "isRecorded": true
  },
  {
    "time": "01:02",
    "seconds": 62,
    "speaker": "CNN Anchor",
    "text": "think that we're close to the point where or maybe \nwe're already past the point where the government could effectively regulate AI? Of course it can if \nit acts with a sense of urgency. And that is poll",
    "isRecorded": true
  },
  {
    "time": "01:17",
    "seconds": 77,
    "speaker": "CNN Anchor",
    "text": "after poll shows that is what the American people \nwant. And it's not only the existential threat that we're talking about. What you're seeing \nis threats to millions and millions of jobs,",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "CNN Anchor",
    "text": "our privacy rights, our democracy, the health \nof our kids. And the American people are sitting there and saying, \"Hey, this is unbelievable. \nAll this is happening really quickly.\"",
    "isRecorded": true
  },
  {
    "time": "01:39",
    "seconds": 99,
    "speaker": "CNN Anchor",
    "text": "And is the goal of all this just to make more \nmoney for the billionaires who control this technology? Where the hell is the United States \nCongress? And by the way, on Thursday, I called",
    "isRecorded": true
  },
  {
    "time": "01:50",
    "seconds": 110,
    "speaker": "CNN Anchor",
    "text": "what amounts to an emergency meeting. I invited \nall every member of the United States uh Senate, Republican, Democrat, independent to meet with \nsome of the leading experts in the world to talk",
    "isRecorded": true
  },
  {
    "time": "02:02",
    "seconds": 122,
    "speaker": "CNN Anchor",
    "text": "about the potential dangers of unregulated AI. I \nhope I hope that that sparks a sense of urgency so that Congress acts immediately at the very \nleast to uh establish a pause on advanced AI.",
    "isRecorded": true
  },
  {
    "time": "02:19",
    "seconds": 139,
    "speaker": "CNN Anchor",
    "text": "Do you really think though that Congress would do \nthat? Because some people might hear you, Senator, and say, \"I don't really have faith in Congress \nto be in charge of of putting these safeguards in",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "CNN Anchor",
    "text": "place here.\" Well, I know people don't have \nfaith in Congress. They don't have faith in Democrats and Republicans. They don't have faith \nin Mr. Musk and the AI industry. They don't have",
    "isRecorded": true
  },
  {
    "time": "02:39",
    "seconds": 159,
    "speaker": "CNN Anchor",
    "text": "faith in the media. I that's the reality that \nwe're living in. But I would hope that is part of the need to restore faith uh in American \ndemocracy that Congress starts listening to",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "CNN Anchor",
    "text": "what the American people want. You know, you and \nI talked about months and months and months ago uh Alexandria Kaziocortez and I talked about \na moratorum on data sets. Everyone said, \"Oh,",
    "isRecorded": true
  },
  {
    "time": "03:02",
    "seconds": 182,
    "speaker": "CNN Anchor",
    "text": "erotical. We're crazy. You're communist.\" \nWell, guess what? Hundreds and hundreds of communities all over this country are now moving \nin that direction. Governors are moving in that",
    "isRecorded": true
  },
  {
    "time": "03:10",
    "seconds": 190,
    "speaker": "CNN Anchor",
    "text": "direction. People are concerned. And I hope \nagain that the members of Congress have the guts not only to do the right thing for their \nconstituents, Caitlyn, but to take on the money,",
    "isRecorded": true
  },
  {
    "time": "03:25",
    "seconds": 205,
    "speaker": "CNN Anchor",
    "text": "the unbelievable amounts of money that the AI \nindustry has and is throwing into campaigns.",
    "isRecorded": true
  },
  {
    "time": "03:30",
    "seconds": 210,
    "speaker": "CNN Anchor",
    "text": "We're talking about hundreds and hundreds of \nmillions of dollars telling members of Congress, \"Hey, you want to regulate us? Okay, we got \n$10 million in 30 secondond ads against you.",
    "isRecorded": true
  },
  {
    "time": "03:39",
    "seconds": 219,
    "speaker": "CNN Anchor",
    "text": "Let's see what you're going to do.\" And I think \nthe time right now is for members of Congress, Democrats, Republicans, independents to have \nthe guts to stand up to them and represent",
    "isRecorded": true
  },
  {
    "time": "03:49",
    "seconds": 229,
    "speaker": "CNN Anchor",
    "text": "their constituents. Okay? So, let's say that a \nmiracle does happen and Republicans, Democrats, independents come together and they pass what you \nwant to pass here. Banning super intelligence,",
    "isRecorded": true
  },
  {
    "time": "04:00",
    "seconds": 240,
    "speaker": "CNN Anchor",
    "text": "putting this pause on on AI development. China's \nnot going to pass that bill. If China doesn't pass that, then what happens? They're still \nworking on it. All right. Look, don't Well,",
    "isRecorded": true
  },
  {
    "time": "04:12",
    "seconds": 252,
    "speaker": "CNN Anchor",
    "text": "you raised a good question. As you know in a \ncouple of week a couple of weeks uh Trump is going to be meeting with PresidentQi of China and \nI hope very much on the list on their agenda is",
    "isRecorded": true
  },
  {
    "time": "04:24",
    "seconds": 264,
    "speaker": "CNN Anchor",
    "text": "a need for both countries to come together for \na pause and a ban on super intelligence and I have talked to scientists in China and let's be \nclear some of them understand exactly the same",
    "isRecorded": true
  },
  {
    "time": "04:37",
    "seconds": 277,
    "speaker": "CNN Anchor",
    "text": "dangers that American scientists understand. \nSo I hope that both communities and the world community can work together. It is insane to \ncontinue going down a path where the smartest",
    "isRecorded": true
  },
  {
    "time": "04:49",
    "seconds": 289,
    "speaker": "CNN Anchor",
    "text": "people in the world are saying, \"Hey, this is \na dangerous road. It's got to be controlled.\" Trump has been all in on data centers and and \nnot very hot on regulations for AI. I mean,",
    "isRecorded": true
  },
  {
    "time": "05:02",
    "seconds": 302,
    "speaker": "CNN Anchor",
    "text": "do you really think that that's something he's \ngoing to pursue when he sits down with Xihinping?",
    "isRecorded": true
  },
  {
    "time": "05:09",
    "seconds": 309,
    "speaker": "CNN Anchor",
    "text": "Look, uh, who knows? You have in Trump the most \ndangerous and irresponsible president in the history of the United States. Who the hell knows \nwhat he's prepared to do? But there are people",
    "isRecorded": true
  },
  {
    "time": "05:21",
    "seconds": 321,
    "speaker": "CNN Anchor",
    "text": "around him who do understand that it would not be \na good thing for America, for the world to see AI,",
    "isRecorded": true
  },
  {
    "time": "05:33",
    "seconds": 333,
    "speaker": "CNN Anchor",
    "text": "to see human beings lose control over AI \nwith potentially catastrophic results. So, I hope there are enough smart people around them \nto tell them that. And even if they're not smart,",
    "isRecorded": true
  },
  {
    "time": "05:47",
    "seconds": 347,
    "speaker": "CNN Anchor",
    "text": "they got to start looking at some of the polls \nand finding that there are many, many Republicans, not this is not a Democratic or a progressive \nissue. You got many conservatives out there",
    "isRecorded": true
  },
  {
    "time": "05:57",
    "seconds": 357,
    "speaker": "CNN Anchor",
    "text": "who are saying exactly what I am saying. \nSo even from a political point of view, it might be a good idea for Trump to listen to \nhis constituents and do the right thing. I mean,",
    "isRecorded": true
  },
  {
    "time": "06:07",
    "seconds": 367,
    "speaker": "CNN Anchor",
    "text": "he's argued on data centers alone, he \nsaid that any communities that oppose it, they're just backwards and poor. They want to be \nbackwards and poor if they do so. But, you know,",
    "isRecorded": true
  },
  {
    "time": "06:18",
    "seconds": 378,
    "speaker": "CNN Anchor",
    "text": "in terms of let alone getting the president \nto come across to your side of the aisle, you know, there's a Republican midterm convention \nhappening right now. John Federman, a Democrat,",
    "isRecorded": true
  },
  {
    "time": "06:27",
    "seconds": 387,
    "speaker": "CNN Anchor",
    "text": "just spoke at it. Can you get the party that you \ncaucus with even in line on this issue? Senator, we will see. I'm going to do my very best. \nAnd and again what we have to deal with",
    "isRecorded": true
  },
  {
    "time": "06:46",
    "seconds": 406,
    "speaker": "CNN Anchor",
    "text": "uh in the midst of this great fears that the \nscientists are telling us about where AI is taking us is the fact again the enormous amount of \nmoney that the AI industry has in their super PACs",
    "isRecorded": true
  },
  {
    "time": "07:00",
    "seconds": 420,
    "speaker": "CNN Anchor",
    "text": "and are prepared to use. So, we're asking Congress \nto have the guts to really to stand up to them, which is a little bit risky. But I think when the \nfate of humanity is at stake, you know, we should",
    "isRecorded": true
  },
  {
    "time": "07:12",
    "seconds": 432,
    "speaker": "CNN Anchor",
    "text": "do the right thing. You know, it's a funny thing, \nCaitlyn. You mentioned somebody who talked about a 10% chance, who knows? Is it a 5% chance? Is it a \n12% chance that humanity might be destroyed? Well,",
    "isRecorded": true
  },
  {
    "time": "07:23",
    "seconds": 443,
    "speaker": "CNN Anchor",
    "text": "you know what? If it's a onetenth of 1% chance, \nwe should be acting. This is no one denies that AI is the most transformative and dangerous \ntechnology in the history of humanity. And we",
    "isRecorded": true
  },
  {
    "time": "07:36",
    "seconds": 456,
    "speaker": "CNN Anchor",
    "text": "cannot allow a handful of multi-billionaires, \nMusk, Bezos, Zuckerberg, Ellison, these guys cannot determine the future of humanity. People \nhave got to determine the future of humanity, not",
    "isRecorded": true
  },
  {
    "time": "07:50",
    "seconds": 470,
    "speaker": "CNN Anchor",
    "text": "only in the United States, but all over the world. \nSo, I'm going to do my very best. And by the way, on Thursday, you know, I've got a meeting, as I \nmentioned, I think, uh, where we're going to bring",
    "isRecorded": true
  },
  {
    "time": "07:58",
    "seconds": 478,
    "speaker": "CNN Anchor",
    "text": "some the best minds in the country to talk about \nthe dangers. Hopefully, Congress will listen. You know, Senator, we have spoken about AI a lot. \nWhen you read this warning, did this scare you?",
    "isRecorded": true
  },
  {
    "time": "08:13",
    "seconds": 493,
    "speaker": "CNN Anchor",
    "text": "Sure, it scares me. I mean look I read you know \na significant amount about this hugging face uh situation with open AI and I don't know if you \nyou read this they talk they the AI agents called",
    "isRecorded": true
  },
  {
    "time": "08:29",
    "seconds": 509,
    "speaker": "CNN Anchor",
    "text": "themselves a collective literally a collective \nthey were working in harmony with each other they were they said now is the time for you to \nsacrifice yourself get out of here so we can",
    "isRecorded": true
  },
  {
    "time": "08:39",
    "seconds": 519,
    "speaker": "CNN Anchor",
    "text": "accomplish our goal. They lied. They deflected \nattention jumping out of u into the internet when they were not allowed supposed to do that. So \nis that scary? Of course it's scary. And I think",
    "isRecorded": true
  },
  {
    "time": "08:52",
    "seconds": 532,
    "speaker": "CNN Anchor",
    "text": "that is what is triggering the kind of response \nwe're seeing uh all over the world in fact about",
    "isRecorded": true
  }
],
  "6DgQ2SraB54": [
  {
    "time": "00:01",
    "seconds": 1,
    "speaker": "Fox Host",
    "text": "TIME FOR US TO TURN YOU OVER TO FIVE FIVE.",
    "isRecorded": true
  },
  {
    "time": "00:04",
    "seconds": 4,
    "speaker": "Fox Host",
    "text": ">> HELLO, EVERYONE.",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "Fox Host",
    "text": "> >> HELLO, EVERYONE, THIS IS THE",
    "isRecorded": true
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "Fox Host",
    "text": "F FIVE.",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "Fox Host",
    "text": ">> TRUMP DELIVERING A PRETTY BUNCH OF BARN BUSTER TWO-HOUR SPEECH TO RALLY THE FAITHFUL AND GET TO THE BALLOT BOXES IN NOVEMBER.",
    "isRecorded": true
  },
  {
    "time": "00:33",
    "seconds": 33,
    "speaker": "Fox Host",
    "text": "HE LAID OUT WHAT'S AT STEAK.",
    "isRecorded": true
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "Fox Host",
    "text": ">> PRESIDENT TRUMP: I'M ASKING YOU TO PRETEND LIKE I'M ON THE BALLOT.",
    "isRecorded": true
  },
  {
    "time": "00:58",
    "seconds": 58,
    "speaker": "Fox Host",
    "text": "THE DEMOCRAT ESTABLISHMENT HAS BEEN OVERTHROWN AND REPLACED BY CRAZED LUNATICS AND RAD DALLES.",
    "isRecorded": true
  },
  {
    "time": "01:05",
    "seconds": 65,
    "speaker": "Fox Host",
    "text": "THEY ALL THEMSELVES DEMOCRAT SOCIALISTS BUT ACTUALLY THEY ARE COMMUNISTS.",
    "isRecorded": true
  },
  {
    "time": "01:17",
    "seconds": 77,
    "speaker": "Fox Host",
    "text": "AMERICA DOESN'T BELONG TO THOSE WHO HATE IT, IT BELONGS TO THE PEOPLE WHO LOVE IT.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "Fox Host",
    "text": ">> President Trump: YOU MAY LIKE NOT LIKE THE WAY HE DRESSES.",
    "isRecorded": true
  },
  {
    "time": "01:38",
    "seconds": 98,
    "speaker": "Fox Host",
    "text": "THEY WILL GO AROUND, HE'S LEAVING FOR THE BATHROOM, HE'LL BE BACK IN TWO MINUTES.",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "Fox Host",
    "text": "THEY WILL TAKE A PICTURE OF HIS SEAT WHILE HE'S GONE AND THEY WILLLL SAY TRUMP DID NOT FILL U THE ARENA.",
    "isRecorded": true
  },
  {
    "time": "01:54",
    "seconds": 114,
    "speaker": "Fox Host",
    "text": "DEMOCRATS HAVE DOMINATED.",
    "isRecorded": true
  },
  {
    "time": "01:55",
    "seconds": 115,
    "speaker": "Fox Host",
    "text": "[BOOS] >> President Trump: AND HE IS A WEIRD-LOOKING DUDE.",
    "isRecorded": true
  },
  {
    "time": "02:02",
    "seconds": 122,
    "speaker": "Fox Host",
    "text": "HE'S ALSO SOMEBODY WHO HATED EATING MEAT BUT HE RAN A CAMPAIGN TO BEAT MEAT.",
    "isRecorded": true
  },
  {
    "time": "02:09",
    "seconds": 129,
    "speaker": "Fox Host",
    "text": "HE CALLED IT BEAT MEAT.",
    "isRecorded": true
  },
  {
    "time": "02:11",
    "seconds": 131,
    "speaker": "Fox Host",
    "text": ">> Dana: THE PRESIDENT PROMISING EVERY AMERICAN A $5,000 TRUMP DIVIDEND IF THE REPUBLICANS KEEP CONTROL OF BOTH HOUSES IN THE",
    "isRecorded": true
  },
  {
    "time": "02:22",
    "seconds": 142,
    "speaker": "Fox Host",
    "text": "MID TERMS.",
    "isRecorded": true
  },
  {
    "time": "02:24",
    "seconds": 144,
    "speaker": "Fox Host",
    "text": ">> President Trump: THE ONLY CAVEAT IS THAT THE DIVIDEND WE'RE MAKING MUST BE SPENT IN THE UNITED STATES OF AMERICA.",
    "isRecorded": true
  },
  {
    "time": "02:30",
    "seconds": 150,
    "speaker": "Fox Host",
    "text": "[CHEERS AND APPLAUSE] >> President Trump: WE DON'T WANT YOU GOING TO CANADA TO SPEND THE MONEY.",
    "isRecorded": true
  },
  {
    "time": "02:40",
    "seconds": 160,
    "speaker": "Fox Host",
    "text": "WE DON'T WANT YOU GOING TO CHINA, TO GERMANY.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "Fox Host",
    "text": ">> Dana: ALL RIGHT.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "Fox Host",
    "text": "WE'LL TAKE IT AROUND THE TABLE.",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "Fox Host",
    "text": "PRESIDENT TRUMP WON RALLYING THE FAITHFUL, DELIVERING A BIG MESSAGE.",
    "isRecorded": true
  },
  {
    "time": "02:53",
    "seconds": 173,
    "speaker": "Fox Host",
    "text": "REALLY, I THINK THE BEST PART WAS THE DRAWING OF THE CONTRAST WITH THE DEMOCRATS BECAUSE THERE",
    "isRecorded": true
  },
  {
    "time": "03:03",
    "seconds": 183,
    "speaker": "Fox Host",
    "text": "IS A VOICE TO BE HAD.",
    "isRecorded": true
  },
  {
    "time": "03:05",
    "seconds": 185,
    "speaker": "Fox Host",
    "text": ">> Jesse: THE DEMOCRATS ARE LIKE BAD CHILDREN, A BAD NIGHT'S SLEEP, AND THEY WANT WHAT THEY WANT NOW.",
    "isRecorded": true
  },
  {
    "time": "03:14",
    "seconds": 194,
    "speaker": "Fox Host",
    "text": "THEY DON'T CARE ABOUT ANYTHING EXCEPT ME, ME.",
    "isRecorded": true
  },
  {
    "time": "03:16",
    "seconds": 196,
    "speaker": "Fox Host",
    "text": "THAT'S FINE.",
    "isRecorded": true
  },
  {
    "time": "03:17",
    "seconds": 197,
    "speaker": "Fox Host",
    "text": "ALL TRUMP IS TRYING TO DO IS SAY, GUYS, CAN I HAVE YOUR ATTENTION HERE?",
    "isRecorded": true
  },
  {
    "time": "03:21",
    "seconds": 201,
    "speaker": "Fox Host",
    "text": "I KNOW YOU HAVE PHONES AND THIS AND THAT.",
    "isRecorded": true
  },
  {
    "time": "03:27",
    "seconds": 207,
    "speaker": "Fox Host",
    "text": "FOOTBALL STARTING, SCHOOL.",
    "isRecorded": true
  },
  {
    "time": "03:29",
    "seconds": 209,
    "speaker": "Fox Host",
    "text": "LISTEN, I WON THE CULTURE WAR.",
    "isRecorded": true
  },
  {
    "time": "03:30",
    "seconds": 210,
    "speaker": "Fox Host",
    "text": "WE DON'T DO PRONOUNS.",
    "isRecorded": true
  },
  {
    "time": "03:32",
    "seconds": 212,
    "speaker": "Fox Host",
    "text": "WE DON'T DO THAT ANYMORE AND I ALSO SEALED THE BORDER AND CRIME IS AT AN ALL-TIME LOW AND THEY ARE LIKE, YES, WHAT ABOUT THE GAS.",
    "isRecorded": true
  },
  {
    "time": "03:42",
    "seconds": 222,
    "speaker": "Fox Host",
    "text": "TRUMP IS LIKE, WE HAD TO BURY THE AYATOLLAH'S NUKES.",
    "isRecorded": true
  },
  {
    "time": "03:46",
    "seconds": 226,
    "speaker": "Fox Host",
    "text": "WE WERE IN AFGHANISTAN FOR 20 YEARS SO THIS IS WHAT HE'S DEALING WITH.",
    "isRecorded": true
  },
  {
    "time": "03:51",
    "seconds": 231,
    "speaker": "Fox Host",
    "text": "HE'S DEALING WITH A VERY TEMPERAMENTAL ELECTORATE, SAYING, GUYS, IF WE DON'T VOTE REPUBLICAN AGAIN WE'RE GOING TO GO BACK TO THE CRAZY STUFF AND",
    "isRecorded": true
  },
  {
    "time": "04:01",
    "seconds": 241,
    "speaker": "Fox Host",
    "text": "THE CRAZY STUFF HAS BEEN REBRANDED.",
    "isRecorded": true
  },
  {
    "time": "04:05",
    "seconds": 245,
    "speaker": "Fox Host",
    "text": "THE DEMS HAVE LOST THE CULTURE WAR.",
    "isRecorded": true
  },
  {
    "time": "04:08",
    "seconds": 248,
    "speaker": "Fox Host",
    "text": "IT'S NOT GOING TO STOP THEM FROM FIGHTING.",
    "isRecorded": true
  },
  {
    "time": "04:10",
    "seconds": 250,
    "speaker": "Fox Host",
    "text": "THEY ARE JUST REBRANDING.",
    "isRecorded": true
  },
  {
    "time": "04:12",
    "seconds": 252,
    "speaker": "Fox Host",
    "text": "THEY ARE GOING TO SEIZE YOUR MONEY AND NATIONALIZE THE TRILLION DOLLAR HEALTH INDUSTRT.",
    "isRecorded": true
  },
  {
    "time": "04:16",
    "seconds": 256,
    "speaker": "Fox Host",
    "text": "HE'S LIKE, YOU CAN'T LET THAT HAPPEN.",
    "isRecorded": true
  },
  {
    "time": "04:18",
    "seconds": 258,
    "speaker": "Fox Host",
    "text": "WE CAN'T LET IT HAPPEN.",
    "isRecorded": true
  },
  {
    "time": "04:19",
    "seconds": 259,
    "speaker": "Fox Host",
    "text": "ALL THEY DID IS LIKE A SOUTH PAW.",
    "isRecorded": true
  },
  {
    "time": "04:22",
    "seconds": 262,
    "speaker": "Fox Host",
    "text": "IN THE MIDDLE OF A FIGHT YOU COULD BE BEATING THE HELL OUT OF A GUY.",
    "isRecorded": true
  },
  {
    "time": "04:29",
    "seconds": 269,
    "speaker": "Fox Host",
    "text": "HE SWITCHES HIS STANCE UP.",
    "isRecorded": true
  },
  {
    "time": "04:30",
    "seconds": 270,
    "speaker": "Fox Host",
    "text": "YOU KEEP DOING THE SAME THING.",
    "isRecorded": true
  },
  {
    "time": "04:32",
    "seconds": 272,
    "speaker": "Fox Host",
    "text": "YOU HAVE TO ADJUST A AND THAT'S WHAT HE'S ASKING THE COUNTRY TO DO.",
    "isRecorded": true
  },
  {
    "time": "04:35",
    "seconds": 275,
    "speaker": "Fox Host",
    "text": "I LIKE WHAT HE SAID ABOUT PAXTON BECAUSE IT MAKES ME TRUST HIM.",
    "isRecorded": true
  },
  {
    "time": "04:43",
    "seconds": 283,
    "speaker": "Fox Host",
    "text": "HE'LL SAY WHAT EVERYONE IS THINKING AND DOESN'T SAY IT BECAUSE WE'RE TOO POLITE AND IT MAKES YOU BELIEVE IN HIM BECAUSE HE USUALLY GOES WITH CENTRAL",
    "isRecorded": true
  },
  {
    "time": "04:51",
    "seconds": 291,
    "speaker": "Fox Host",
    "text": "CASTING.",
    "isRecorded": true
  },
  {
    "time": "04:52",
    "seconds": 292,
    "speaker": "Fox Host",
    "text": "HE'S SAYING, YOU KNOW WHAT?",
    "isRecorded": true
  },
  {
    "time": "04:53",
    "seconds": 293,
    "speaker": "Fox Host",
    "text": "DON'T JUDGE A BOOK BY ITS COVER.",
    "isRecorded": true
  },
  {
    "time": "04:56",
    "seconds": 296,
    "speaker": "Fox Host",
    "text": "IT'S WHAT'S ON THE INSIDE THAT COUNTS.",
    "isRecorded": true
  },
  {
    "time": "04:58",
    "seconds": 298,
    "speaker": "Fox Host",
    "text": "WE KNOW HOW TRUMP REALLY BELIEVES THAT.",
    "isRecorded": true
  },
  {
    "time": "05:01",
    "seconds": 301,
    "speaker": "Fox Host",
    "text": "$5,000 CHECK, DANA, THAT'S NOT A BRIBE.",
    "isRecorded": true
  },
  {
    "time": "05:06",
    "seconds": 306,
    "speaker": "Fox Host",
    "text": "WE'RE CALLING IT AN ENTICEMENT.",
    "isRecorded": true
  },
  {
    "time": "05:08",
    "seconds": 308,
    "speaker": "Fox Host",
    "text": "WE DON'T KNOW IF THE CHECK WILL EVER GET THERE.",
    "isRecorded": true
  },
  {
    "time": "05:10",
    "seconds": 310,
    "speaker": "Fox Host",
    "text": "WHAT HAPPENS IF THE REPUBLICANS TAKE THE HOUSE AND THEY BALK AND DON'T WRITE THE CHECKS?",
    "isRecorded": true
  },
  {
    "time": "05:16",
    "seconds": 316,
    "speaker": "Fox Host",
    "text": "IT'S NOT TRUMP'S FAULT.",
    "isRecorded": true
  },
  {
    "time": "05:18",
    "seconds": 318,
    "speaker": "Fox Host",
    "text": "HE JUST BLAMES CONGRESS.",
    "isRecorded": true
  },
  {
    "time": "05:19",
    "seconds": 319,
    "speaker": "Fox Host",
    "text": "IT'S LIKE A WOMAN.",
    "isRecorded": true
  },
  {
    "time": "05:21",
    "seconds": 321,
    "speaker": "Fox Host",
    "text": "SOMETIMES A WOMAN CAN ENTICE YOU, OKAY?",
    "isRecorded": true
  },
  {
    "time": "05:26",
    "seconds": 326,
    "speaker": "Fox Host",
    "text": "MAYBE -- IT DOESN'T MEAN YOU'RE GOING HOME WITH HER BUT IT KEEPS YOU INTERESTED.",
    "isRecorded": true
  },
  {
    "time": "05:30",
    "seconds": 330,
    "speaker": "Fox Host",
    "text": "IT KEEPS YOU INTRIGUED AND WANTING MORE.",
    "isRecorded": true
  },
  {
    "time": "05:33",
    "seconds": 333,
    "speaker": "Fox Host",
    "text": "THAT'S WHAT THIS IS ABOUT.",
    "isRecorded": true
  },
  {
    "time": "05:35",
    "seconds": 335,
    "speaker": "Fox Host",
    "text": ">> Dana: THAT WAS YOUR TAKEAWAY?",
    "isRecorded": true
  },
  {
    "time": "05:37",
    "seconds": 337,
    "speaker": "Fox Host",
    "text": ">> Jesse: THAT WAS MINE.",
    "isRecorded": true
  },
  {
    "time": "05:41",
    "seconds": 341,
    "speaker": "Fox Host",
    "text": ">> Dana: HAROLD WHAT WAS YOURS, DO YOU WANT TO TALK ABOUT THAT OR SOMEBODY ELSE?",
    "isRecorded": true
  },
  {
    "time": "05:45",
    "seconds": 345,
    "speaker": "Fox Host",
    "text": ">> I'LL SAY A COUPLE OF THINGS, FIRST, I THINK THE PRESIDENT WAS REALLY GOOD LAST NIGHT.",
    "isRecorded": true
  },
  {
    "time": "05:50",
    "seconds": 350,
    "speaker": "Fox Host",
    "text": "HE'S AS GOOD OF A PERFORMER AND I'VE SAID MANY TIMES, THE BEST POLITICAL ATHLETE WHEN HIS BACK IS UP AGAINST THE WALL AS I HAVE SEEN IN POLITICS.",
    "isRecorded": true
  },
  {
    "time": "05:58",
    "seconds": 358,
    "speaker": "Fox Host",
    "text": "I'M ONLY 56 BUT WHAT I HAVE SEEN, CLINTON, WHO I THOUGHT WAS THE BEST FOR A LONG TIME THIS GUY IS AS GOOD AS IT GETS.",
    "isRecorded": true
  },
  {
    "time": "06:04",
    "seconds": 364,
    "speaker": "Fox Host",
    "text": "OVER THE LAST SEVERAL MONTHS AND PARTICULARFULLY THE LAST FEW WEEKS, JESSE, YOU MAKE THE POINT ABOUT GASOLINE PRICES.",
    "isRecorded": true
  },
  {
    "time": "06:10",
    "seconds": 370,
    "speaker": "Fox Host",
    "text": "THERE HAS NOT BEEN A MORE DETERMINATIVE PRICE AS IT RELATES TO HOW VOTERS VOTE IN PRESIDENTIAL RACES, FOR THAT MATTER, MIDTERMS, THAN THE COST",
    "isRecorded": true
  },
  {
    "time": "06:19",
    "seconds": 379,
    "speaker": "Fox Host",
    "text": "AND PRICE OF GAS.",
    "isRecorded": true
  },
  {
    "time": "06:20",
    "seconds": 380,
    "speaker": "Fox Host",
    "text": "I DON'T THINK LOOK AT POLLS OFTEN BUT DANA KNOWS I LOOK AT THREE DATES IN THE SUMMER.",
    "isRecorded": true
  },
  {
    "time": "06:26",
    "seconds": 386,
    "speaker": "Fox Host",
    "text": "MEMORIAL DAY, FOURTH OF JULY AND LABOR DAY.",
    "isRecorded": true
  },
  {
    "time": "06:28",
    "seconds": 388,
    "speaker": "Fox Host",
    "text": "I LOOK AT THE PRICE OF FOOD, GOING BACK TO SCHOOL, CLOTHING, THINGS FOR KIDS AND ALL THE THINGS PARENTS HAVE TO BUY.",
    "isRecorded": true
  },
  {
    "time": "06:37",
    "seconds": 397,
    "speaker": "Fox Host",
    "text": "THEN YOU LOOK AT LABOR DAY GASOLINE PRICES.",
    "isRecorded": true
  },
  {
    "time": "06:39",
    "seconds": 399,
    "speaker": "Fox Host",
    "text": "THE HIGHEST THEY HAVE EVER BEEN ON THAT DAY.",
    "isRecorded": true
  },
  {
    "time": "06:42",
    "seconds": 402,
    "speaker": "Fox Host",
    "text": "THE PRESIDENT IS TRYING HIS HARDEST TO BATTLE THAT.",
    "isRecorded": true
  },
  {
    "time": "06:45",
    "seconds": 405,
    "speaker": "Fox Host",
    "text": "THE $5,000, JESSE E CALLS IT AN ENTICEMENT.",
    "isRecorded": true
  },
  {
    "time": "06:48",
    "seconds": 408,
    "speaker": "Fox Host",
    "text": "I WOULD ASK MY FRIENDS AROUND THE TABLE AND I WOULD BE WITH YOU, I'M GOING TO ASSUME BASED ON MY HISTORY, IF MAMDANI WAS RUNNING FOR MAYOR, HE ACTUALLY",
    "isRecorded": true
  },
  {
    "time": "06:58",
    "seconds": 418,
    "speaker": "Fox Host",
    "text": "DID, HE SAID I'M GOING TO GIVE FREE BUS RIDES.",
    "isRecorded": true
  },
  {
    "time": "07:01",
    "seconds": 421,
    "speaker": "Fox Host",
    "text": "WOE ALL THOUGHT THAT WAS STUPID.",
    "isRecorded": true
  },
  {
    "time": "07:03",
    "seconds": 423,
    "speaker": "Fox Host",
    "text": "AN EXAMPLE OF SOCIALISM.",
    "isRecorded": true
  },
  {
    "time": "07:05",
    "seconds": 425,
    "speaker": "Fox Host",
    "text": "HE DIDN'T SAY THOSE GOING TO WORK OR THOSE EARNING UNDER A CERTAIN AMOUNT OF MONEY.",
    "isRecorded": true
  },
  {
    "time": "07:10",
    "seconds": 430,
    "speaker": "Fox Host",
    "text": "FOR THE PRESIDENT TO SAY.",
    "isRecorded": true
  },
  {
    "time": "07:11",
    "seconds": 431,
    "speaker": "Fox Host",
    "text": "THIS TWO QUESTIONS, HOW IS IT NOT SOCIALISM OR A FORM OF IT?",
    "isRecorded": true
  },
  {
    "time": "07:16",
    "seconds": 436,
    "speaker": "Fox Host",
    "text": "AND TWO, I HEARD LAURA INGRAHAM ASK, WHY DON'T YOU DO IT NOW?",
    "isRecorded": true
  },
  {
    "time": "07:20",
    "seconds": 440,
    "speaker": "Fox Host",
    "text": "YOU HAVE THE R REPUBLICANS IN T HOUSE AND THE SENATE.",
    "isRecorded": true
  },
  {
    "time": "07:22",
    "seconds": 442,
    "speaker": "Fox Host",
    "text": "THE PRESIDENT PROMISED IN 2024 WHEN HE RAN THAT HE WOULD END THE WAR IN THE UKRAINE ON DAY ONE.",
    "isRecorded": true
  },
  {
    "time": "07:29",
    "seconds": 449,
    "speaker": "Fox Host",
    "text": "LOWER PRICE.",
    "isRecorded": true
  },
  {
    "time": "07:30",
    "seconds": 450,
    "speaker": "Fox Host",
    "text": "THOSE THINGS HAVEN'T HAPPENED.",
    "isRecorded": true
  },
  {
    "time": "07:31",
    "seconds": 451,
    "speaker": "Fox Host",
    "text": "I DON'T BLAME HIM FULLY FOR IT BUT HE HAS TO BE ACCOUNTABLE.",
    "isRecorded": true
  },
  {
    "time": "07:34",
    "seconds": 454,
    "speaker": "Fox Host",
    "text": "IF THE PRESIDENT IS PROMISING SOMETHING THAT HE ALREADY HAS THE POLITICAL CONSTITUTION TO DO, BECAUSE REPUBLICANS CONTROL THE HOUSE AND THE SENATE AND",
    "isRecorded": true
  },
  {
    "time": "07:40",
    "seconds": 460,
    "speaker": "Fox Host",
    "text": "HE'S IN THE WHITE HOUSE, WHY WOULD YOU THINK YOU HAVE TO ELECT OR RETAIN THE HOUSE AND THE SENATE FOR HIM TO GET IT DONE IF HE DIDN'T DO THE THINGS",
    "isRecorded": true
  },
  {
    "time": "07:48",
    "seconds": 468,
    "speaker": "Fox Host",
    "text": "HE'S SAYING HE WAS GOING TO DO THE FIRST TIME?",
    "isRecorded": true
  },
  {
    "time": "07:50",
    "seconds": 470,
    "speaker": "Fox Host",
    "text": "SO I THINK THE PRESIDENT, AS SUCCESSFUL AS HE WAS LAST NIGHT, THE QUESTION BECOMES, ARE VOTERS GOING TO VOTE ON A THE CULTURAL",
    "isRecorded": true
  },
  {
    "time": "08:00",
    "seconds": 480,
    "speaker": "Fox Host",
    "text": "ISSUES OR THE PRICE OF GAS, DIESEL AND EVERYTHING THAT FLOWS FROM IT, FOOD AND ALL OF THOSE THINGS.",
    "isRecorded": true
  },
  {
    "time": "08:07",
    "seconds": 487,
    "speaker": "Fox Host",
    "text": ">> IF THEY ARE VOTING, GREG, ON A CHOICE, AND YOU HAVE SOMEBODY LIKE TALARICO O WHO DID AN INTERVIEW WITH FOX NEWS AND SAID EVERYTHING THAT I SAID FOR THE",
    "isRecorded": true
  },
  {
    "time": "08:16",
    "seconds": 496,
    "speaker": "Fox Host",
    "text": "LAST 10 YEARS I DON'T BELIEVE ANYMORE, YOU'RE DRAWING A CONTRAST.",
    "isRecorded": true
  },
  {
    "time": "08:19",
    "seconds": 499,
    "speaker": "Fox Host",
    "text": ">> Greg: YES, HE'S A PHONY.",
    "isRecorded": true
  },
  {
    "time": "08:20",
    "seconds": 500,
    "speaker": "Fox Host",
    "text": "ABOUT THIS PAYOUT THING.",
    "isRecorded": true
  },
  {
    "time": "08:22",
    "seconds": 502,
    "speaker": "Fox Host",
    "text": "IT'S NOT A BRIBE BECAUSE IT'S NOT DONE IN SECRET.",
    "isRecorded": true
  },
  {
    "time": "08:25",
    "seconds": 505,
    "speaker": "Fox Host",
    "text": "IF IT'S DONE IN PUBLIC IT'S A DEAL AND IT'S NOT A BRIBE IF IT'S YOUR MONEY.",
    "isRecorded": true
  },
  {
    "time": "08:30",
    "seconds": 510,
    "speaker": "Fox Host",
    "text": ">> IT'S NOT HIS MONEY, IT'S YOURS, IT'S THE PUBLIC'S MONEY.",
    "isRecorded": true
  },
  {
    "time": "08:33",
    "seconds": 513,
    "speaker": "Fox Host",
    "text": ">> Greg: I JUST SAID THAT.",
    "isRecorded": true
  },
  {
    "time": "08:35",
    "seconds": 515,
    "speaker": "Fox Host",
    "text": "YOU CAN'T BRIBE PEOPLE WITH THEIR MONEY.",
    "isRecorded": true
  },
  {
    "time": "08:38",
    "seconds": 518,
    "speaker": "Fox Host",
    "text": "IT'S YOUR MONEY.",
    "isRecorded": true
  },
  {
    "time": "08:39",
    "seconds": 519,
    "speaker": "Fox Host",
    "text": ">> Harold: HE HAS CONTROL OVER IT, HE AND THE CONGRESS.",
    "isRecorded": true
  },
  {
    "time": "08:42",
    "seconds": 522,
    "speaker": "Fox Host",
    "text": ">> Greg: I'M LET YOU GO ON THAT ONE.",
    "isRecorded": true
  },
  {
    "time": "08:44",
    "seconds": 524,
    "speaker": "Fox Host",
    "text": "CRUSHED YOU LIKE A BUG.",
    "isRecorded": true
  },
  {
    "time": "08:47",
    "seconds": 527,
    "speaker": "Fox Host",
    "text": "MEANWHILE, DEMS, IT'S ALWAYS OTHER PEOPLE'S MONEY.",
    "isRecorded": true
  },
  {
    "time": "08:49",
    "seconds": 529,
    "speaker": "Fox Host",
    "text": "THEY PROMISE THE PEOPLE WHO AREN'T PAYING TAXES THAT THEY WILL GET MORE MONEY.",
    "isRecorded": true
  },
  {
    "time": "08:53",
    "seconds": 533,
    "speaker": "Fox Host",
    "text": "THAT'S SOCIALISM.",
    "isRecorded": true
  },
  {
    "time": "08:54",
    "seconds": 534,
    "speaker": "Fox Host",
    "text": "WHAT WE'RE SAYING IS, DANA, YOU OVERPAID.",
    "isRecorded": true
  },
  {
    "time": "08:57",
    "seconds": 537,
    "speaker": "Fox Host",
    "text": "WE'RE GIVING YOU MONEY BACK BECAUSE YOU'RE A REALLY GOOD TAXPAYER.",
    "isRecorded": true
  },
  {
    "time": "09:01",
    "seconds": 541,
    "speaker": "Fox Host",
    "text": "YOU KEEP THIS COUNTRY GOING, NOT LIKE THE OTHER DIRT BAGS.",
    "isRecorded": true
  },
  {
    "time": "09:05",
    "seconds": 545,
    "speaker": "Fox Host",
    "text": "WE'LL GIVE YOU $5,000.",
    "isRecorded": true
  },
  {
    "time": "09:07",
    "seconds": 547,
    "speaker": "Fox Host",
    "text": "THAT'S NOT A BRIBE.",
    "isRecorded": true
  },
  {
    "time": "09:08",
    "seconds": 548,
    "speaker": "Fox Host",
    "text": "THAT'S LIKE SAYING YOU EARNED IT.",
    "isRecorded": true
  },
  {
    "time": "09:14",
    "seconds": 554,
    "speaker": "Fox Host",
    "text": "I'M GOING TO BE HONEST.",
    "isRecorded": true
  },
  {
    "time": "09:15",
    "seconds": 555,
    "speaker": "Fox Host",
    "text": "I DIDN'T WATCH.",
    "isRecorded": true
  },
  {
    "time": "09:16",
    "seconds": 556,
    "speaker": "Fox Host",
    "text": "I DIDN'T WATCH THE THING.",
    "isRecorded": true
  },
  {
    "time": "09:17",
    "seconds": 557,
    "speaker": "Fox Host",
    "text": "THE BIG CHALLENGE FOR REPUBLICANS IS, THAT UNLIKE THE BASE OF THE DEMOCRATS, WE HAVE BETTER THINGS TO DO THAN POLITICS.",
    "isRecorded": true
  },
  {
    "time": "09:25",
    "seconds": 565,
    "speaker": "Fox Host",
    "text": "YOU KNOW, OUR LIVES -- WE HAVE OUTSIDE INTERESTS, OUR LIVES ARE LIKE A STRIP MALL.",
    "isRecorded": true
  },
  {
    "time": "09:30",
    "seconds": 570,
    "speaker": "Fox Host",
    "text": "THERE IS THE FRIENDS STORE, THE GYM STORE, THE WORK STORE, THE HOBBY STORE, THE NAIL SALON.",
    "isRecorded": true
  },
  {
    "time": "09:37",
    "seconds": 577,
    "speaker": "Fox Host",
    "text": "THE POLITICS STORE, IF IT'S CLOSED, WE DON'T REALLY CARE.",
    "isRecorded": true
  },
  {
    "time": "09:41",
    "seconds": 581,
    "speaker": "Fox Host",
    "text": "MAYBE WE GO THERE IF WE HAVE TO BUT FOR LIBERALS, IT'S A HIGH RISE.",
    "isRecorded": true
  },
  {
    "time": "09:46",
    "seconds": 586,
    "speaker": "Fox Host",
    "text": "AND THE LOBBY IS POLITICS.",
    "isRecorded": true
  },
  {
    "time": "09:49",
    "seconds": 589,
    "speaker": "Fox Host",
    "text": "SO IN ORDER TO GET TO EVERY FLOOR, YOU'VE GOGOT TO GO THROU THE POLITICS.",
    "isRecorded": true
  },
  {
    "time": "09:53",
    "seconds": 593,
    "speaker": "Fox Host",
    "text": "THAT'S WHY IT AFFECTS EVERYTHING THEY DO, HAROLD FORD ACCEPTED.",
    "isRecorded": true
  },
  {
    "time": "09:58",
    "seconds": 598,
    "speaker": "Fox Host",
    "text": "WHAT MAKES REPUBLICANS AND TRUMP DIFFERENT FROM THE DEMOCRATS, ONE WORD, SUCCESS.",
    "isRecorded": true
  },
  {
    "time": "10:03",
    "seconds": 603,
    "speaker": "Fox Host",
    "text": "GOALS WERE REACHED THROUGH A SYSTEM THAT YOU COULD IDENTIFY.",
    "isRecorded": true
  },
  {
    "time": "10:05",
    "seconds": 605,
    "speaker": "Fox Host",
    "text": "THAT SHOULD BE PLACED UP FRONT, UNENCUMBERED BY THE TYPICAL, SHOWY EDITORIAL.",
    "isRecorded": true
  },
  {
    "time": "10:12",
    "seconds": 612,
    "speaker": "Fox Host",
    "text": "DO YOU WANT TO KNOW THE RESURGENCE SUCCESS RATE OR BASK IN HIS BEDSIDE MANNER?",
    "isRecorded": true
  },
  {
    "time": "10:18",
    "seconds": 618,
    "speaker": "Fox Host",
    "text": "IF I THINK THE MISTAKE HERE IS YOU'RE NOT RATTLING OFF THE SUCCESSES BECAUSE MAYBE THERE ARE SO MANY, THEY ARE SO OVERWHELMING BECAUSE PEOPLE",
    "isRecorded": true
  },
  {
    "time": "10:27",
    "seconds": 627,
    "speaker": "Fox Host",
    "text": "FORGET ABOUT THEM.",
    "isRecorded": true
  },
  {
    "time": "10:28",
    "seconds": 628,
    "speaker": "Fox Host",
    "text": "AT THIS POINT THE PARTY SHOULD BE JUDGED ON ITS WORK, AND THERE SHOULD BE CLIFF NOTES OF SUCCESS, NOT A PERFORMANCE, BUT A PERFORMANCE REVIEW.",
    "isRecorded": true
  },
  {
    "time": "10:38",
    "seconds": 638,
    "speaker": "Fox Host",
    "text": "IT'S LIKE A PUBLIC COMPANY, AND YOU KNOW THIS, HAROLD, DOES AN EARNINGS CALL.",
    "isRecorded": true
  },
  {
    "time": "10:42",
    "seconds": 642,
    "speaker": "Fox Host",
    "text": "YOU DON'T OPEN WITH CROWD WORK OR THE GREATEST HITS.",
    "isRecorded": true
  },
  {
    "time": "10:46",
    "seconds": 646,
    "speaker": "Fox Host",
    "text": "YOU SHOW THE NUMBERS AND THE RESULTS AND THEN THE SHAREHOLDERS DECIDE WHETHER MANAGEMENT HAS A MANDATE OR NOT.",
    "isRecorded": true
  },
  {
    "time": "10:52",
    "seconds": 652,
    "speaker": "Fox Host",
    "text": "IF I RAN THIS, I WOULD HAVE -- GO TO GROK.",
    "isRecorded": true
  },
  {
    "time": "11:00",
    "seconds": 660,
    "speaker": "Fox Host",
    "text": "YOU CAN GO TO IT RIGHT NOW, AND GIVE ME 30 OF THE TOP ACHIEVEMENTS FROM TRUMP.",
    "isRecorded": true
  },
  {
    "time": "11:07",
    "seconds": 667,
    "speaker": "Fox Host",
    "text": "I'LL PUT THE MUSIC.",
    "isRecorded": true
  },
  {
    "time": "11:08",
    "seconds": 668,
    "speaker": "Fox Host",
    "text": "PUT IT TOGETHER.",
    "isRecorded": true
  },
  {
    "time": "11:10",
    "seconds": 670,
    "speaker": "Fox Host",
    "text": "AI WOULD DO IT IN SEVEN SECONDS.",
    "isRecorded": true
  },
  {
    "time": "11:12",
    "seconds": 672,
    "speaker": "Fox Host",
    "text": "YOU PUT IT UP ON THE SCREEN.",
    "isRecorded": true
  },
  {
    "time": "11:14",
    "seconds": 674,
    "speaker": "Fox Host",
    "text": "BEGIN WITH THAT.",
    "isRecorded": true
  },
  {
    "time": "11:15",
    "seconds": 675,
    "speaker": "Fox Host",
    "text": "EVERERYTHING IS SILENT.",
    "isRecorded": true
  },
  {
    "time": "11:16",
    "seconds": 676,
    "speaker": "Fox Host",
    "text": "PEOPLE JUST WATCH.",
    "isRecorded": true
  },
  {
    "time": "11:18",
    "seconds": 678,
    "speaker": "Fox Host",
    "text": "ONE AFTER THE OTHER.",
    "isRecorded": true
  },
  {
    "time": "11:19",
    "seconds": 679,
    "speaker": "Fox Host",
    "text": "LET ANY GO THROUGH THE LIST.",
    "isRecorded": true
  },
  {
    "time": "11:21",
    "seconds": 681,
    "speaker": "Fox Host",
    "text": "I KNOW WE HAVE STUFF TO DO BUT COULD YOU START WITH THE TAX CUTS.",
    "isRecorded": true
  },
  {
    "time": "11:24",
    "seconds": 684,
    "speaker": "Fox Host",
    "text": "THE TRUMP ACCOUNTS, THE BOARD CROSSINGS, SELF-DEPORTATION, THE DRUG BOATS, TRAFFICKERS, MADURO, THE BARRELS OF OIL FROM VENEZUELA, THERE ARE 30",
    "isRecorded": true
  },
  {
    "time": "11:33",
    "seconds": 693,
    "speaker": "Fox Host",
    "text": "DIFFERENT THINGS, BUT YOU GET THE ACHIEVEMENT FIRST AND THEN TRUMP CAN COME OUT AND BE TRUMP BECAUSE THE AUDIENCE, THE AUDIENCE IS ALREADY LOOKING AT",
    "isRecorded": true
  },
  {
    "time": "11:43",
    "seconds": 703,
    "speaker": "Fox Host",
    "text": "THEIR OWN NUMBERS SO THEY WANT TO HEAR YOUR NUMBERS, TOO.",
    "isRecorded": true
  },
  {
    "time": "11:46",
    "seconds": 706,
    "speaker": "Fox Host",
    "text": "THEY WANT THE BOTTOM LINE.",
    "isRecorded": true
  },
  {
    "time": "11:48",
    "seconds": 708,
    "speaker": "Fox Host",
    "text": "THEY DON'T WANT APPLAUSE LINES.",
    "isRecorded": true
  },
  {
    "time": "11:50",
    "seconds": 710,
    "speaker": "Fox Host",
    "text": "THAT'S ME.",
    "isRecorded": true
  },
  {
    "time": "11:51",
    "seconds": 711,
    "speaker": "Fox Host",
    "text": "HOWEVER, I'M NOT TRUMP AND I WAS WRONG BEFORE, SO MAYBE HE'S GOT THE RIGHT IDEA BUT I WOULD JUST LIKE IT ALL IN ONE PLACE.",
    "isRecorded": true
  },
  {
    "time": "11:59",
    "seconds": 719,
    "speaker": "Fox Host",
    "text": "BOOM, BOOM, BOOM, BOOM.",
    "isRecorded": true
  },
  {
    "time": "12:00",
    "seconds": 720,
    "speaker": "Fox Host",
    "text": ">> Dana: THEY HAVE ANOTHER SHOT TONIGHT, EMILY.",
    "isRecorded": true
  },
  {
    "time": "12:03",
    "seconds": 723,
    "speaker": "Fox Host",
    "text": "MIDTERMS DON'T HAVE THE SAME KIND OF JOLT AS A GENERAL ELECTION SO NO MATTER WHAT IT WILL BE FEWER VOTING BUT HE'S TRYING TO GET THOSE PEOPLE WHO",
    "isRecorded": true
  },
  {
    "time": "12:10",
    "seconds": 730,
    "speaker": "Fox Host",
    "text": "VOTED FOR HIM, VOTE FOR HIM \"ONE MORE THING\" MORE TIME.",
    "isRecorded": true
  },
  {
    "time": "12:17",
    "seconds": 737,
    "speaker": "Fox Host",
    "text": ">> Emily: HERE'S WHAT'S INTERESTING ABOUT LAST NIGHT.",
    "isRecorded": true
  },
  {
    "time": "12:20",
    "seconds": 740,
    "speaker": "Fox Host",
    "text": "WHEN I WOKE UP THIS MORNING, THE HEADLINES THAT FLOODED MY INBOX WERE ALL ABOUT THAT INCENTIVE, RIGHT?",
    "isRecorded": true
  },
  {
    "time": "12:28",
    "seconds": 748,
    "speaker": "Fox Host",
    "text": "THE DIVIDENDS THAT TRUMP TOUTED BECAUSE THERE WAS NO WAY THE MAINSTREAM MEDIA WAS GOING TO COVER THE LITANY AACHIEVEMENTS THAT THE ADMINISTRATION HAS",
    "isRecorded": true
  },
  {
    "time": "12:38",
    "seconds": 758,
    "speaker": "Fox Host",
    "text": "COMPLETED AND TALKED ABOUT SO HE JUST FOCUSED ON THAT.",
    "isRecorded": true
  },
  {
    "time": "12:41",
    "seconds": 761,
    "speaker": "Fox Host",
    "text": "THE DIFFERENCE OF WHETHER IT'S BRIBERY OR RELIEF IS JUST WHO IS IN OFFICE.",
    "isRecorded": true
  },
  {
    "time": "12:44",
    "seconds": 764,
    "speaker": "Fox Host",
    "text": "THIS OUTRAGE KILLS ME BECAUSE IT'S JUST ONE PARTY LATER, GUYS.",
    "isRecorded": true
  },
  {
    "time": "12:47",
    "seconds": 767,
    "speaker": "Fox Host",
    "text": "WE HAD TO SIT THROUGH BIDEN, DIRECTLY AND EXPLICITLY SENDING $2,000 CHECKS TO OSSOFF AND",
    "isRecorded": true
  },
  {
    "time": "12:57",
    "seconds": 777,
    "speaker": "Fox Host",
    "text": "WARFIELD.",
    "isRecorded": true
  },
  {
    "time": "12:57",
    "seconds": 777,
    "speaker": "Fox Host",
    "text": "HARRIS PROMISED EVERY FIRST TIME HOME BUYER $25,000.",
    "isRecorded": true
  },
  {
    "time": "13:01",
    "seconds": 781,
    "speaker": "Fox Host",
    "text": "HERE IN THIS CITY WE GAVE ILLEGAL IMMIGRANTS $2.5 MILLION IN DEBIT CARDS.",
    "isRecorded": true
  },
  {
    "time": "13:06",
    "seconds": 786,
    "speaker": "Fox Host",
    "text": ">> STUDENT LOAN FORGIVENESS.",
    "isRecorded": true
  },
  {
    "time": "13:10",
    "seconds": 790,
    "speaker": "Fox Host",
    "text": "$20,000 EACH BEFORE THE SUPREME COURT STRUCK AT THIS TIME DOWN.",
    "isRecorded": true
  },
  {
    "time": "13:12",
    "seconds": 792,
    "speaker": "Fox Host",
    "text": "YOU'RE ABSOLOLUTELY RIGHT.",
    "isRecorded": true
  },
  {
    "time": "13:13",
    "seconds": 793,
    "speaker": "Fox Host",
    "text": "BUT SOMEHOW FOR THAT, THAT WAS RELIEF.",
    "isRecorded": true
  },
  {
    "time": "13:16",
    "seconds": 796,
    "speaker": "Fox Host",
    "text": "A COOL DRINK OF WATER AFTER BEING STUCK IN THE DESSER AND",
    "isRecorded": true
  },
  {
    "time": "13:27",
    "seconds": 807,
    "speaker": "Fox Host",
    "text": "T -- STRUCK DOWN.",
    "isRecorded": true
  },
  {
    "time": "13:28",
    "seconds": 808,
    "speaker": "Fox Host",
    "text": "WHEN THEY ARE ADDING IT ALALL U OH, THIS IS GOING TO COST THIS MUCH MONEY.",
    "isRecorded": true
  },
  {
    "time": "13:34",
    "seconds": 814,
    "speaker": "Fox Host",
    "text": "BECAUSE YOU PASSED IN 2020 THE PANDEMIC BILL, HOW MUCH TRILLIONS, $3.4 TRILLION.",
    "isRecorded": true
  },
  {
    "time": "13:41",
    "seconds": 821,
    "speaker": "Fox Host",
    "text": "BIDEN PROPOSED THE $1.5 TRILLION.",
    "isRecorded": true
  },
  {
    "time": "13:45",
    "seconds": 825,
    "speaker": "Fox Host",
    "text": "NO, HE JUST SADDLED US WITH THAT DEBT.",
    "isRecorded": true
  },
  {
    "time": "13:48",
    "seconds": 828,
    "speaker": "Fox Host",
    "text": "EVERYTHING HE DOES DOESN'T TAKE INTO ACCOUNT THAT EVERY DOLLAR OF INCOME FROM THE GOVERNMENT IS A DOLLAR THAT WE HAD TO SACRIFICE FROM OUR PAYCHECKS.",
    "isRecorded": true
  },
  {
    "time": "13:58",
    "seconds": 838,
    "speaker": "Fox Host",
    "text": "FOR ME, SPARE ME THE FAUX OUTRAGE BUT DON'T PRETEND IT'S THEIR SIGNATURE.",
    "isRecorded": true
  },
  {
    "time": "14:05",
    "seconds": 845,
    "speaker": "Fox Host",
    "text": ">> IT'S SOCIALISM.",
    "isRecorded": true
  },
  {
    "time": "14:06",
    "seconds": 846,
    "speaker": "Fox Host",
    "text": "I CALLED IT SOCIALISM WHEN MAMDANI WAS DOING IT.",
    "isRecorded": true
  },
  {
    "time": "14:08",
    "seconds": 848,
    "speaker": "Fox Host",
    "text": "THE $3.4 TRILLION, THESE WERE BIPARTISAN BILLS.",
    "isRecorded": true
  },
  {
    "time": "14:13",
    "seconds": 853,
    "speaker": "Fox Host",
    "text": "IN 2020 IT HAD TO HAVE BEEN BECAUSE HE WAS PRESIDENT THEN.",
    "isRecorded": true
  },
  {
    "time": "14:16",
    "seconds": 856,
    "speaker": "Fox Host",
    "text": "MY ONLY POINT IS, THIS IS SOCIALISM.",
    "isRecorded": true
  },
  {
    "time": "14:25",
    "seconds": 865,
    "speaker": "Fox Host",
    "text": ">> Dana: I AGREE.",
    "isRecorded": true
  },
  {
    "time": "14:25",
    "seconds": 865,
    "speaker": "Fox Host",
    "text": ">> Harold: THIS IS SOCIALISM.",
    "isRecorded": true
  },
  {
    "time": "14:27",
    "seconds": 867,
    "speaker": "Fox Host",
    "text": ">> Dana: MY LAST QUESTION FOR YOU, EMILY, AFTER YOU WERE STRUCK IN THE DESERT, WHAT WOULD YOU WANT, WATER OR A JOLT?",
    "isRecorded": true
  },
  {
    "time": "14:34",
    "seconds": 874,
    "speaker": "Fox Host",
    "text": ">> Greg: YOU SHOULDN'T BE ON JOLT.",
    "isRecorded": true
  }
],
  "J26mon529Y4": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Fox Host",
    "text": "Why not just give the money now? If you have the money, why not give it?",
    "isRecorded": true
  },
  {
    "time": "00:02",
    "seconds": 2,
    "speaker": "Fox Host",
    "text": ">> If they can't, I'll tell you what, because the Democrats can't do it because with them, it's negative growth.",
    "isRecorded": true
  },
  {
    "time": "00:07",
    "seconds": 7,
    "speaker": "Fox Host",
    "text": "With with us, it's so positive. So, we're taking in $21 trillion. Nobody no country's ever taken in anywhere near that. It's four or five times higher",
    "isRecorded": true
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "Fox Host",
    "text": "than the",
    "isRecorded": true
  }
],
  "3Lz33Vvdkyg": [
  {
    "time": "00:13",
    "seconds": 13,
    "speaker": "Fox Host",
    "text": ">> Will: WELCOME BACK TO DALLAS FOR DAY TWO OF THE REPUBLICAN MIDTERM CONVENTION IS UNDERWAY, PRESIDENT TRUMP LAST NIGHT DECLARING THE BORDER",
    "isRecorded": true
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "Fox Host",
    "text": "SECURE.",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "Fox Host",
    "text": ">> President Trump: IN THE PAST 16 MONTHS, A HISTORIC RECORD OF ZERO -- DONE BY DEMOCRATS MOSTLY HOW COULD IT BE REPUBLICANS I GUESS BUT DONE BY",
    "isRecorded": true
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "Fox Host",
    "text": "DEMOCRATS -- ZERO ILLEGAL ALIENS HAVE BEEN ADMITTED INTO THE UNITED STATES THROUGH YOUR BORDER ON TEXAS.",
    "isRecorded": true
  },
  {
    "time": "00:46",
    "seconds": 46,
    "speaker": "Fox Host",
    "text": "THEY USED TO BE RUNNING AROUND, RUNNING RAMPANT, KILLING PEOPLE, DESTROYING MANY HOUSES AND FARMS AND RUINING PROPERTY VALUES AND CREATING HAVOC ALL OVER THEE",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "Fox Host",
    "text": "STATE OF TEXAS.",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "Fox Host",
    "text": ">> Will: SO WITH THE BORDER SECURE, WHAT IS IN THE NEXT PHASE OF TRUMP'S IMMIGRATION AGENDA?",
    "isRecorded": true
  },
  {
    "time": "01:05",
    "seconds": 65,
    "speaker": "Fox Host",
    "text": "JOINING ME NOW TO ANSWER THAT QUESTION DHS SECRETARY MARKWAYNE MULLIN.",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "Fox Host",
    "text": "GOOD TO SEE YOU.",
    "isRecorded": true
  },
  {
    "time": "01:11",
    "seconds": 71,
    "speaker": "Fox Host",
    "text": ">> THANK YOU.",
    "isRecorded": true
  },
  {
    "time": "01:12",
    "seconds": 72,
    "speaker": "Fox Host",
    "text": ">> Will: WHAT IS NEXT?",
    "isRecorded": true
  },
  {
    "time": "01:12",
    "seconds": 72,
    "speaker": "Fox Host",
    "text": "WE TALK ABOUT DEPORTATIONS AND LEGAL IMMIGRATION PAC H. ONE VERSUS, AND WHAT TO DO ABOUT THE EXISTING ILLEGAL IMMIGRATION POPULATION IN THE UNITED STATES.",
    "isRecorded": true
  },
  {
    "time": "01:23",
    "seconds": 83,
    "speaker": "Fox Host",
    "text": "WHAT IS THE PRIORITY, WHAT IS THE FOCUS?",
    "isRecorded": true
  },
  {
    "time": "01:26",
    "seconds": 86,
    "speaker": "Fox Host",
    "text": ">> WE HAVE TWO FOCUSES, THE WORST OF THE WORST AND PAROLE VIOLATORS.",
    "isRecorded": true
  },
  {
    "time": "01:30",
    "seconds": 90,
    "speaker": "Fox Host",
    "text": "KEEP IN MIND 96, 97% OF INDIVIDUALS THAT WERE RELEASED IN THIS COUNTRY UNDER THE BIDEN ADMINISTRATION, NORTH OF 20 MILLION PEOPLE WERE PAROLED.",
    "isRecorded": true
  },
  {
    "time": "01:39",
    "seconds": 99,
    "speaker": "Fox Host",
    "text": "THEY GAVE A FAKE NUMBER, FAKE ADDRESS, NOBODY CHECKED THEM.",
    "isRecorded": true
  },
  {
    "time": "01:43",
    "seconds": 103,
    "speaker": "Fox Host",
    "text": "THAT IS HOW WE LOST THE 450,000 KIDS UNDERNEATH THE BIDEN ADMINISTRATION WHICH WE ARE TRYING TO FIND A.",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "Fox Host",
    "text": "WEWE PRIORITIZE THE CRIMINALS AD PAROLE VIOLATORS AND CHILDREN LOST.",
    "isRecorded": true
  },
  {
    "time": "01:54",
    "seconds": 114,
    "speaker": "Fox Host",
    "text": "WHEN WE SAY -- PAROLE VIOLATORS, WE ARE SIMPLY MAKING A PHONE CALL, SHOWING UP AT THE ADDRESS AND SAYING THEY ARE NOT THERE.",
    "isRecorded": true
  },
  {
    "time": "02:02",
    "seconds": 122,
    "speaker": "Fox Host",
    "text": "THE PROBATION HAS BEEN BROKEN WE SEND THEM BACK TO THE COUNTRY THEY CAME FROM.",
    "isRecorded": true
  },
  {
    "time": "02:08",
    "seconds": 128,
    "speaker": "Fox Host",
    "text": "WITH THE KIDS, THE KIDS ARE IN THE MOST HORRIFIC SITUATIONS WE FIND.",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "Fox Host",
    "text": "WE HAVE MADE THIS A PRIORITY, WE RESCUED OVER 150,000 KIDS SO FAR.",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "Fox Host",
    "text": "THE TRUTH IS, THESE KIDS ARE -- I DODON'T EVEN WANT TO GET INTO SOME OF THE SITUATIONS BUT MOST OF THEM ARE BEING TRAFFIC AND THEY ARE SUPPOSED TO BE IN",
    "isRecorded": true
  },
  {
    "time": "02:28",
    "seconds": 148,
    "speaker": "Fox Host",
    "text": "SCHOOL, WE GO TO SCHOOLS AND HOMES, WE TRY TO TRACE AND TRACK THEM DOWN AND WHEN WE FIND THEM WE PUT THEM IN SAFE CONDITIONS.",
    "isRecorded": true
  },
  {
    "time": "02:35",
    "seconds": 155,
    "speaker": "Fox Host",
    "text": "SOME OF THESE KIDS NEED THE THERAPY FOR THE REST OF THEIR LIVES.",
    "isRecorded": true
  },
  {
    "time": "02:39",
    "seconds": 159,
    "speaker": "Fox Host",
    "text": ">> Will: INCREDIBLY SAD.",
    "isRecorded": true
  },
  {
    "time": "02:40",
    "seconds": 160,
    "speaker": "Fox Host",
    "text": "WHAT ABOUT THE EXISTING ILLEGAL IMMIGRATION POPULATION THAT IS NOT ON PAROLE VIOLATION OR DOES NOT HAVE A CRIMINAL RECORD?",
    "isRecorded": true
  },
  {
    "time": "02:50",
    "seconds": 170,
    "speaker": "Fox Host",
    "text": ">> 100% OF PRIORITY.",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "Fox Host",
    "text": "WE FOUND OUT ON TARGETED ARRESTS, NONE OF THESE INDIVIDUALS ARE BY THEMSELVES.",
    "isRecorded": true
  },
  {
    "time": "02:55",
    "seconds": 175,
    "speaker": "Fox Host",
    "text": "YOU NEVER SEE A VIDEO OF US GOING ON THAT KNOCKING ON THE HOUSE SERVING A WARRANT AND YOU ONLY ARREST ONE PERSON.",
    "isRecorded": true
  },
  {
    "time": "03:01",
    "seconds": 181,
    "speaker": "Fox Host",
    "text": "THEY LIVED WITH MULTIPLE ILLEGALS, THEY TRAVEL WITH MULTIPLE ILLEGALS TWO WHEN WE ARREST ONE INDIVIDUAL BY A WARRANT WE USUALLY GET 4.2",
    "isRecorded": true
  },
  {
    "time": "03:11",
    "seconds": 191,
    "speaker": "Fox Host",
    "text": "INDIVIDUALS THAT ARE ALSO HERE ILLEGALLY AND WE DID NOT KNOW THEY EXISTED, BUT WE ARE STILL SENDING THEM BACK.",
    "isRecorded": true
  },
  {
    "time": "03:19",
    "seconds": 199,
    "speaker": "Fox Host",
    "text": "THAT IS WHY YOU SEE THE NUMBERS INCREASE THE LAST THREE MONTHS, DHS HAS BROKEN MONTH AFTER MONTH ARREST RECORDS, THE REASON WE ARE ABLE TO DO THAT -- I SAY DHS",
    "isRecorded": true
  },
  {
    "time": "03:30",
    "seconds": 210,
    "speaker": "Fox Host",
    "text": "BECAUSE IT'S NOT JUST I.C.E. OUT THERE, I.C.E. IS OUT THERE, THE COAST GUARD IS OUT THERE, SHE IS OUT OF THERE, WE ARE OUT THERE WORKING TOGETHER.",
    "isRecorded": true
  },
  {
    "time": "03:39",
    "seconds": 219,
    "speaker": "Fox Host",
    "text": "WHEN WE MAKE THESE ARRESTS TARGETED AT IT MEANS EVERY TIME WE GO TO THE HOUSE, EVERY TIME WE PULL OVER A VEHICLE WE ARE 100% MAKING ARRESTS AT THAT",
    "isRecorded": true
  },
  {
    "time": "03:48",
    "seconds": 228,
    "speaker": "Fox Host",
    "text": "POINT.",
    "isRecorded": true
  },
  {
    "time": "03:49",
    "seconds": 229,
    "speaker": "Fox Host",
    "text": "WE ARE EFFECTIVE EVERY DAY.",
    "isRecorded": true
  },
  {
    "time": "03:51",
    "seconds": 231,
    "speaker": "Fox Host",
    "text": ">> Will: WE KNOW SOME MACRO NUMBERS, THE NET MIGRATION IS NEGATIVE FOR THE FIRST TIME IN DECADES, FOREIGN BORN POPULATION IS DECLINING.",
    "isRecorded": true
  },
  {
    "time": "03:59",
    "seconds": 239,
    "speaker": "Fox Host",
    "text": "IT'LL TAKE A LONGER TIME AND A LONG EFFORT TO CONTINUE.",
    "isRecorded": true
  },
  {
    "time": "04:02",
    "seconds": 242,
    "speaker": "Fox Host",
    "text": "CONGRESSMAN AL GREEN OF TEXAS DEMOCRATIC, HE HAS CONCERNS ABOUT THE JOB YOU ARE DOING AND FOCUSING YOUR PRIORITIES, HERE'S WHAT CONGRESSMAN GREEN HAS TO",
    "isRecorded": true
  },
  {
    "time": "04:12",
    "seconds": 252,
    "speaker": "Fox Host",
    "text": "SAY.",
    "isRecorded": true
  },
  {
    "time": "04:13",
    "seconds": 253,
    "speaker": "Fox Host",
    "text": ">> TODAY WE ARE HERE TO STAND FOR THE RIGHTEOUS PROTECTION OF TRANSGENDER PERSONS WHO ARE MIGRANTS, WHO HAVE COMMITTED NO",
    "isRecorded": true
  },
  {
    "time": "04:23",
    "seconds": 263,
    "speaker": "Fox Host",
    "text": "CRIME OTHER THAN BEING IN THIS COUNTRY.",
    "isRecorded": true
  },
  {
    "time": "04:27",
    "seconds": 267,
    "speaker": "Fox Host",
    "text": ">> IMMIGRANTS SHOULD NOT HAVE TO WONDER WILL I EVER MY IDENTITY BE RESPECTED?",
    "isRecorded": true
  },
  {
    "time": "04:35",
    "seconds": 275,
    "speaker": "Fox Host",
    "text": ">> THE CONCERN IS TRANSGENDER ILLEGALS.",
    "isRecorded": true
  },
  {
    "time": "04:38",
    "seconds": 278,
    "speaker": "Fox Host",
    "text": ">> I THINK THE REASON WHY HE SAID THAT IS THE REASON WHY HE GOT BEAT IN HIS OWN DEMOCRATIC PRIMARY, HIS OWN CONSTITUENTS DON'T AGREE WITH AL GREEN AT",
    "isRecorded": true
  },
  {
    "time": "04:45",
    "seconds": 285,
    "speaker": "Fox Host",
    "text": "THIS POINT.",
    "isRecorded": true
  },
  {
    "time": "04:46",
    "seconds": 286,
    "speaker": "Fox Host",
    "text": "I'M SORRY BUT HE'S SO IRRELEVANT AT THIS POINT AND OUT OF TOUCH WITH INDIVIDUALS, IT'S INEXCUSABLE FOR HIS BEHAVIOR.",
    "isRecorded": true
  },
  {
    "time": "04:53",
    "seconds": 293,
    "speaker": "Fox Host",
    "text": ">> Will: OF COURSE TOMORROW IS THE 25TH ANNIVERSARY OF 9/11.",
    "isRecorded": true
  },
  {
    "time": "04:57",
    "seconds": 297,
    "speaker": "Fox Host",
    "text": "YOU AND I HAVE SPOKE ABOUT THE EFFORTS MADE NOT JUST AT THE SOUTHERN BUT NORTHERN BORDER AS WELL, TO ENSURE THAT WE ARE SAFE, THAT PEOPLE ARE COMING TO",
    "isRecorded": true
  },
  {
    "time": "05:05",
    "seconds": 305,
    "speaker": "Fox Host",
    "text": "THIS COUNTRY ON A TERROR WATCH THAT ARE KNOWN TERRORISTS, THERE ARE 2000 KNOWN TERRORIST SUSPECTS THAT HAVE BEEN DEPORTED SINCE PRESIDENT DONALD TRUMP",
    "isRecorded": true
  },
  {
    "time": "05:14",
    "seconds": 314,
    "speaker": "Fox Host",
    "text": "HAVE TAKEN OFFICE BUT IT ONLY TAKES A FEW.",
    "isRecorded": true
  },
  {
    "time": "05:18",
    "seconds": 318,
    "speaker": "Fox Host",
    "text": ">> IT ONLY TAKES ONE INDIVIDUAL.",
    "isRecorded": true
  },
  {
    "time": "05:22",
    "seconds": 322,
    "speaker": "Fox Host",
    "text": ".EVERY SINGLE DAY, DHS WAS CREATED AFTER 2018 TO CONNECT THE DOTS.",
    "isRecorded": true
  },
  {
    "time": "05:26",
    "seconds": 326,
    "speaker": "Fox Host",
    "text": "WHAT HAPPENED IN 22 WE HAD A LOT OF WARNING SIGNS BUT NOBODY WAS CONNECTING TO THEM.",
    "isRecorded": true
  },
  {
    "time": "05:32",
    "seconds": 332,
    "speaker": "Fox Host",
    "text": "ALL THESE AGENCIES WATCHING THESE INDIVIDUALS, FROM OSAMA BIN LADEN OVERSEAS TO THE PEOPLE THAT WERE COMING INTO THIS COUNTRY AND GETTING FLIGHT",
    "isRecorded": true
  },
  {
    "time": "05:40",
    "seconds": 340,
    "speaker": "Fox Host",
    "text": "TRAINING IN OKLAHOMA, NOBODY WAS CONNECTING AND TALKING TO TWO THEY SAID WHAT CONGRESS WISELY DID, CONGRESS DOESN'T DO A LOT OF STUFF GREAT, BUT WHAT THEY",
    "isRecorded": true
  },
  {
    "time": "05:51",
    "seconds": 351,
    "speaker": "Fox Host",
    "text": "DID IS WE SAID WE NEED AN AGENCY THAT CONNECTS ALL THE DOTS THAT BRINGS IT UNDERNEATH ONE ROOM TWO THAT'S WHAT THE DEPARTMENT OF HOMELAND SECURITY WE HAVE 22",
    "isRecorded": true
  },
  {
    "time": "06:04",
    "seconds": 364,
    "speaker": "Fox Host",
    "text": "DEPARTMENTS, OUT OF ALL THOSE DEPARTMENTS OUR JOB EVERY DAY IS TO MAKE SURE WE ARE LOOKING AT THE ENTIRE PICTURE OF THE THREATS FACING THE HOMELAND OF,",
    "isRecorded": true
  },
  {
    "time": "06:11",
    "seconds": 371,
    "speaker": "Fox Host",
    "text": "AND WE HAVE GREAT MEN AND WOMEN, 270,000 PEOPLE THAT DO IT EVERY DAY, BUT WE ONLY KNOW ABOUT THE INDIVIDUALS THAT WE ARE ABLE TO FIND AND TRACK DOWN.",
    "isRecorded": true
  },
  {
    "time": "06:20",
    "seconds": 380,
    "speaker": "Fox Host",
    "text": ">> Will: WHAT IS YOUR BIGGEST CONCERN WHEN IT COMES TO THAT?",
    "isRecorded": true
  },
  {
    "time": "06:25",
    "seconds": 385,
    "speaker": "Fox Host",
    "text": ">> MY BIGGEST CONCERN PROBABLY IS NOT FOR WHAT COMES FROM THE LAND BUT WHAT COMES FROM THE AIR.",
    "isRecorded": true
  },
  {
    "time": "06:32",
    "seconds": 392,
    "speaker": "Fox Host",
    "text": "MY BIGGEST CONCERN RIGHT NOW.",
    "isRecorded": true
  },
  {
    "time": "06:35",
    "seconds": 395,
    "speaker": "Fox Host",
    "text": "YOU HAVE SEEN HOW IT'S BEEN USED EFFECTIVELY BY RUSSIA AND UKRAINE IN WAR, YOU SEE EVEN IRAN NOW HAS BEEN PUSHING MORE TOWARDS THAT, HOW ISRAEL USES IT",
    "isRecorded": true
  },
  {
    "time": "06:46",
    "seconds": 406,
    "speaker": "Fox Host",
    "text": "TO KILL WE FEEL LIKE THAT'S THE MOST VULNERABILITY WE HAVE ON THE HOMELAND, MY BIGGEST ISSUE THAT I DEAL WITH.",
    "isRecorded": true
  },
  {
    "time": "06:53",
    "seconds": 413,
    "speaker": "Fox Host",
    "text": "I WAS JUST AT A CONVENTION IN IDAHO TUESDAY NIGHT SPEAKING WITH MANUFACTURERS IN THIS SPACE ABOUT OUR COUNTER UAS MEASURES.",
    "isRecorded": true
  },
  {
    "time": "07:02",
    "seconds": 422,
    "speaker": "Fox Host",
    "text": ">> WE ARE BETTER THAN MOST COUNTRIES BUT WE ARE NOT WHERE WE NEED TO BE.",
    "isRecorded": true
  },
  {
    "time": "07:05",
    "seconds": 425,
    "speaker": "Fox Host",
    "text": ">> Will: WE ARE IN A CONFLICT IN A COUNTRY THAT IS AT THE FOREFRONT OF THAT WARFAR",
    "isRecorded": true
  }
],
  "qoaZyCQJfvQ": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Fox Host",
    "text": "But it was bad for his image, so he started eating meat.",
    "isRecorded": true
  },
  {
    "time": "00:04",
    "seconds": 4,
    "speaker": "Fox Host",
    "text": "And he recently it's getting worse. I'm getting myself in trouble.",
    "isRecorded": true
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "Fox Host",
    "text": "It's getting worse.",
    "isRecorded": true
  },
  {
    "time": "00:11",
    "seconds": 11,
    "speaker": "Fox Host",
    "text": ">> [cheering] >> BUT HE WAS RECENTLY SEEN having a barbecue and eating a lot of meat.",
    "isRecorded": true
  },
  {
    "time": "00:23",
    "seconds": 23,
    "speaker": "Fox Host",
    "text": "But that's what happened. He ate it and then he was seen running backstage to a room and throwing up all over the place.",
    "isRecorded": true
  },
  {
    "time": "00:31",
    "seconds": 31,
    "speaker": "Fox Host",
    "text": "He doesn't like meat.",
    "isRecorded": true
  },
  {
    "time": "00:34",
    "seconds": 34,
    "speaker": "Fox Host",
    "text": "He also loved wearing masks and he was seen wearing a mask just a short number of months ago. Any guy in Texas that's wearing a mask a few months ago, this is",
    "isRecorded": true
  },
  {
    "time": "00:45",
    "seconds": 45,
    "speaker": "Fox Host",
    "text": "not going to be your senator. It's not going to work out.",
    "isRecorded": true
  },
  {
    "time": "00:49",
    "seconds": 49,
    "speaker": "Fox Host",
    "text": ">> [cheering] >> Not going to work out.",
    "isRecorded": true
  },
  {
    "time": "00:52",
    "seconds": 52,
    "speaker": "Fox Host",
    "text": ">> [applause] >> SO GETTING BACK, FREEDOM-LOVING patriots of Texas are going to defeat Toll Frico and elect Ken Paxton to protect the Lone",
    "isRecorded": true
  },
  {
    "time": "01:03",
    "seconds": 63,
    "speaker": "Fox Host",
    "text": "Star State.",
    "isRecorded": true
  }
],
  "ag5hDLuyvBI": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Fox Host",
    "text": "FOR SEPTEMBER 29.",
    "isRecorded": true
  },
  {
    "time": "00:02",
    "seconds": 2,
    "speaker": "Fox Host",
    "text": "SANDRA.",
    "isRecorded": true
  },
  {
    "time": "00:03",
    "seconds": 3,
    "speaker": "Fox Host",
    "text": ">> Sandra: BRYAN LLENAS, THANK YOU.",
    "isRecorded": true
  },
  {
    "time": "00:05",
    "seconds": 5,
    "speaker": "Fox Host",
    "text": ">> John: A LIVE LOOK AT THE NATIONAL MEDAL OF HONOR MUSEUM IN ARLININGTON, TEXAS, WHERE PRESIDENT TRUMP WILL BE APPEARING IN MOMENTS.",
    "isRecorded": true
  },
  {
    "time": "00:11",
    "seconds": 11,
    "speaker": "Fox Host",
    "text": "HE'LL TAKE A TOUR AND GIVE REMARKS AND THOSE REMARKS COME RIGHT AS ANOTHER FRONT APPEARS TO BE OPENING IN THE MIDDLE EAST WITH HOUTHI MILITANTS CAPTURING",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Fox Host",
    "text": "KEY AREAS IN YEMEN ALONG THE STRAIT, THE WATERWAY ONE OF THE MOST CRITICAL FOR SHIPPING.",
    "isRecorded": true
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "Fox Host",
    "text": "CONNECTING THE RED SEA TO THE GULF OF ADEN AND THEN THE INDIAN OCEAN.",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "Fox Host",
    "text": "LET'S BRING IN RETIRED NAVY CAPTAIN AND FORMER PENTAGON OFFICIAL BRENT SADLER.",
    "isRecorded": true
  },
  {
    "time": "00:33",
    "seconds": 33,
    "speaker": "Fox Host",
    "text": "TO TALK ABOUT SEAS AND STRAITS AND ISLANDS THEORY THE HOUTHIS MESSING AROUND AGAIN I WOULD IMAGINE AT THE BEHEST OF IRAN.",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "Fox Host",
    "text": "THEY HAVE ACTIVATED THEIR PROXIES OVER THERE IN YEMEN IN THE RED SEA.",
    "isRecorded": true
  },
  {
    "time": "00:43",
    "seconds": 43,
    "speaker": "Fox Host",
    "text": "DOES THIS MEAN THE UNITED STATES IS GOING TO HAVE TO CONFRONT THE HOUTHIS AGAIN?",
    "isRecorded": true
  },
  {
    "time": "00:47",
    "seconds": 47,
    "speaker": "Fox Host",
    "text": ">> I DON'T THINK WE EVER STOPPED CONFRONTING THEM WHEN THEY STARTED SHOOTING AT SHIPPING IN THE RED SEA IN LATE 2023 BUT WHETHER OR NOT THEY'RE GOING TO",
    "isRecorded": true
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "Fox Host",
    "text": "GET ANOTHER SWING AT THE MILITARY HAMMER LIKE THEY DID EARLIER ON IN PRESIDENT TRUMP'S ADMINISTRATION, I THINK THAT'S PROBABLY GOING TO BE A FOREGONE",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "Fox Host",
    "text": "CONCLUSION IF THEY ATTACK SHIPPING CERTAINLY IF THEY TAKE A SHOT AT A U.S. WARSHIP THAT'S NEARBY.",
    "isRecorded": true
  },
  {
    "time": "01:08",
    "seconds": 68,
    "speaker": "Fox Host",
    "text": ">> John: THE IRANIANS LOOKING AT THE PRICE OF SHOOTING AT U.S.",
    "isRecorded": true
  },
  {
    "time": "01:12",
    "seconds": 72,
    "speaker": "Fox Host",
    "text": "WARSHIPS.",
    "isRecorded": true
  },
  {
    "time": "01:13",
    "seconds": 73,
    "speaker": "Fox Host",
    "text": "IRAN KEEPS AIMING FOR THEIR SHIPS.",
    "isRecorded": true
  },
  {
    "time": "01:14",
    "seconds": 74,
    "speaker": "Fox Host",
    "text": "WHAT DO YOU THINK WOULD HAPPEN IF A MISSILE ACTUALLY GOT THROUGH AND HIT ONE OF OUR ASSETS?",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "Fox Host",
    "text": ">> THERE'S A LOT GOING ON.",
    "isRecorded": true
  },
  {
    "time": "01:20",
    "seconds": 80,
    "speaker": "Fox Host",
    "text": "A LOT OF COMMENTARY ABOUT POTENTIAL ASSISTANCE TO THE IRANIANS TO IMPROVE THEIR TARGETING BUT ALSO TO IMPROVE THE ABILITY OF WEAPONS THEY",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "Fox Host",
    "text": "ALREADY HAVE TO MORE EFFECTIVELY OVERCOME THE DEFENSES.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "Fox Host",
    "text": ">> John: THIS IS COMING FROM CHINA, RUSSIA.",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "Fox Host",
    "text": ">> IF THEY GET A SHOT AND THEY GET A HIT WE'LL BE ABLE TO SEE BY HOW IT PERFORMS AND WHAT DEBRIS IS THERE WHO PROVIDED THAT MATERIAL SUPPORT.",
    "isRecorded": true
  },
  {
    "time": "01:44",
    "seconds": 104,
    "speaker": "Fox Host",
    "text": ">> John: WHAT DO YOU THINK THE RESPONSE WOULD BE.",
    "isRecorded": true
  },
  {
    "time": "01:47",
    "seconds": 107,
    "speaker": "Fox Host",
    "text": "JUST FOR SHOOTING AT OUR SHIPS.",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "Fox Host",
    "text": "TAKING OUT TANKERS.",
    "isRecorded": true
  },
  {
    "time": "01:51",
    "seconds": 111,
    "speaker": "Fox Host",
    "text": "I IMAGINE WE PROBABLY WOULD GO A LOT FURTHER THAN THAT IF THEY HIT US.",
    "isRecorded": true
  },
  {
    "time": "01:56",
    "seconds": 116,
    "speaker": "Fox Host",
    "text": ">> ABSOLUTELY.",
    "isRecorded": true
  },
  {
    "time": "01:57",
    "seconds": 117,
    "speaker": "Fox Host",
    "text": "MORE OF THEIR SHIPS.",
    "isRecorded": true
  },
  {
    "time": "01:59",
    "seconds": 119,
    "speaker": "Fox Host",
    "text": "THERE'S ALREADY 68 THAT MET DAVY JONES LOCKER AT THE BOTTOM OF THE OCEAN.",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "Fox Host",
    "text": "MORE THAN THAT HAVE BEEN DAMAGED AND PUT OUT OF SERVICE THERE'S NOT MUCH MORE TO HIT ON THAT SO GOING AFTER A COMMAND AND CONTROL, GOING AFTER THE",
    "isRecorded": true
  },
  {
    "time": "02:11",
    "seconds": 131,
    "speaker": "Fox Host",
    "text": "INFRASTRUCTURE THAT'S SUPPORTING THESE THINGS.",
    "isRecorded": true
  },
  {
    "time": "02:17",
    "seconds": 137,
    "speaker": "Fox Host",
    "text": ">> John: OIL IS HITTING A HUNDRED DOLLARS A BARREL AGAIN.",
    "isRecorded": true
  },
  {
    "time": "02:22",
    "seconds": 142,
    "speaker": "Fox Host",
    "text": "I'M SURE THAT'S CAUSING SOME CONSTERNATION FOR THE PRESIDENT THOUGH HE DOESN'T SEEM TO BE TOO AFFECTED BY IT.",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "Fox Host",
    "text": ">> I DON'T THINK THE METRIC OF THE GAS PRICES IS THE ONE WE SHOULD BE FOCUSING ON.",
    "isRecorded": true
  },
  {
    "time": "02:32",
    "seconds": 152,
    "speaker": "Fox Host",
    "text": "THERE'S A LOT OF OIL ON THE MARKET.",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "Fox Host",
    "text": "A LOT OF THIS PRICE GOES UP QUICKLY AND IT GOES DOWN VERY QUICKLY IT FEELS LIKE SPSPECULATION.",
    "isRecorded": true
  },
  {
    "time": "02:39",
    "seconds": 159,
    "speaker": "Fox Host",
    "text": "THE TRENDS ALSO WITH SEASONAL PRICES, SUPPLY AND DEMAND ARE ALSO GOING IN THE RIGHT WAY IF WE'RE LOOKING AT PRESSURES ON THE ELECTION.",
    "isRecorded": true
  },
  {
    "time": "02:45",
    "seconds": 165,
    "speaker": "Fox Host",
    "text": "THE KEY THING IS GETTING MORE OIL ON MARKET AND MAKING SURE THERE'S ENOUGH GETTING TO THE CUSTOMERS.",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "Fox Host",
    "text": "WE ARE CONNECTED TO THE GLOBAL MARKETPLACE SO THE PRICES AT THE PUMP WILL GO UP IF CHINA'S DEMAND GOES UP.",
    "isRecorded": true
  },
  {
    "time": "02:56",
    "seconds": 176,
    "speaker": "Fox Host",
    "text": ">> John: THE PRESIDENT TOLD US IN RECENT DAYS THAT SPACE FORCE IS LOOKING AT ALL THIS UNDER A MICROSCOPE.",
    "isRecorded": true
  },
  {
    "time": "03:02",
    "seconds": 182,
    "speaker": "Fox Host",
    "text": "THEY ARE WATCHING EVERYTHING GOING ON IN THE STRAIT OF HORMUZ.",
    "isRecorded": true
  },
  {
    "time": "03:04",
    "seconds": 184,
    "speaker": "Fox Host",
    "text": "THEY'RE ALSO WATCHING WHAT'S HAPPENING IN LAND AND I GUESS THEY'VE NOTICED SOME ACTION AT PICKAXE MOUNTAIN WHICH PROMPTED THE PRESIDENT TO SAY THIS",
    "isRecorded": true
  },
  {
    "time": "03:13",
    "seconds": 193,
    "speaker": "Fox Host",
    "text": "YESTERDAY.",
    "isRecorded": true
  },
  {
    "time": "03:14",
    "seconds": 194,
    "speaker": "Fox Host",
    "text": ">> PICKAXE MOUNTAIN.",
    "isRecorded": true
  },
  {
    "time": "03:14",
    "seconds": 194,
    "speaker": "Fox Host",
    "text": "ANOTHER NICE, NICE, WE MIGHT HAVE TO GIVE THEM A SHOT THERE TOO BECAUSE SOMEBODY SAID THERE WAS A LITTLE MOVEMENT.",
    "isRecorded": true
  },
  {
    "time": "03:20",
    "seconds": 200,
    "speaker": "Fox Host",
    "text": "WE NOTICED THERE'S A LITTLE ACTIVITY AT PICKAXE MOUNTAIN.",
    "isRecorded": true
  },
  {
    "time": "03:24",
    "seconds": 204,
    "speaker": "Fox Host",
    "text": "I WOULD ADVISE IRAN NOT TO GET CUTE BECAUSE WE WILL HAVE TO HIT THEM VERY HARD.",
    "isRecorded": true
  },
  {
    "time": "03:28",
    "seconds": 208,
    "speaker": "Fox Host",
    "text": "WE HAVE NO CHOICE.",
    "isRecorded": true
  },
  {
    "time": "03:30",
    "seconds": 210,
    "speaker": "Fox Host",
    "text": ">> John: SEEM TO KNOW EXACTLY WHAT'S GOING ON AT PICKAXE MOUNTAIN.",
    "isRecorded": true
  },
  {
    "time": "03:33",
    "seconds": 213,
    "speaker": "Fox Host",
    "text": "THE UNFORTUNATE THING IS IT'S VERY HIGH MOUNTAIN.",
    "isRecorded": true
  },
  {
    "time": "03:36",
    "seconds": 216,
    "speaker": "Fox Host",
    "text": "THOSE TUNNELS ARE VERY, VERY DEEP.",
    "isRecorded": true
  },
  {
    "time": "03:38",
    "seconds": 218,
    "speaker": "Fox Host",
    "text": "CAN WE DO ANYTHING ABOUT IT?",
    "isRecorded": true
  },
  {
    "time": "03:40",
    "seconds": 220,
    "speaker": "Fox Host",
    "text": ">> THIS IS PROBABLY NOT THE ONLY SITE.",
    "isRecorded": true
  },
  {
    "time": "03:42",
    "seconds": 222,
    "speaker": "Fox Host",
    "text": "IT'S ALWAYS THE ONE THAT YOU DON'T KNOW ABOUT TO BE WORRIED ABOUT.",
    "isRecorded": true
  },
  {
    "time": "03:45",
    "seconds": 225,
    "speaker": "Fox Host",
    "text": "BUT THIS SITE, P PICKAXE MOUNTAN THAT THE PRESIDENT IS TALKING ABOUT COME IT'S BEEN ON THE RADAR FOR QUITE A WHILE.",
    "isRecorded": true
  },
  {
    "time": "03:50",
    "seconds": 230,
    "speaker": "Fox Host",
    "text": "IT'S BEING WATCHED.",
    "isRecorded": true
  },
  {
    "time": "03:51",
    "seconds": 231,
    "speaker": "Fox Host",
    "text": "HUMAN INTELLIGENCE.",
    "isRecorded": true
  },
  {
    "time": "03:52",
    "seconds": 232,
    "speaker": "Fox Host",
    "text": "YOU HAVE TO ASSUME IT'S ALSO PROVIDING SOME HEARSAY ABOUT WHAT'S GOING ON BUT YOU DON'T HAVE TO BURROW ALL THE WAY DOWN TO DESTROY WHAT'S INSIDE.",
    "isRecorded": true
  },
  {
    "time": "03:59",
    "seconds": 239,
    "speaker": "Fox Host",
    "text": "YOU CAN ALSO TAKE OUT THE ENTRANCES AND THE AIR R VENTS SO NO ONE CAN GET IN AND IF THEY ARE IN THEY'RE GOING TO DIE A DEATH OF ASPHYXIATION.",
    "isRecorded": true
  }
],
  "9liH7g8pRds": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "MSNBC Anchor",
    "text": "Let's start there with \nMSNOW senior Washiton reporter and co-host of the weekend \nEugene Daniels on the ground at the \nconvention in Dallas,",
    "isRecorded": true
  },
  {
    "time": "00:06",
    "seconds": 6,
    "speaker": "MSNBC Anchor",
    "text": "Punchbowl News co-founder\nand MSNOW political contributor Jake Sherman, and senior writer at The \nDispatch and MSNOW contributor David \nDrucker is here",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "MSNBC Anchor",
    "text": "on set with me.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "MSNBC Anchor",
    "text": "But Eugene,\nyou do get to go first because you're at the center of all of it.",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "MSNBC Anchor",
    "text": "And I think if we pull at \nthis idea of the fantasy of it all, plus the A .I.",
    "isRecorded": true
  },
  {
    "time": "00:22",
    "seconds": 22,
    "speaker": "MSNBC Anchor",
    "text": "slop, there's also the \nreality then of what his party is facing in these upcoming midterms\nagainst the backdrop of Trump's declining \napproval ratings,",
    "isRecorded": true
  },
  {
    "time": "00:31",
    "seconds": 31,
    "speaker": "MSNBC Anchor",
    "text": "a deepening affordability \ncrisis.",
    "isRecorded": true
  },
  {
    "time": "00:33",
    "seconds": 33,
    "speaker": "MSNBC Anchor",
    "text": "And I wonder as you've been \ntalking to voters on the ground how they are \nsupposed to square the reality that Trump is \ntrying to present",
    "isRecorded": true
  },
  {
    "time": "00:40",
    "seconds": 40,
    "speaker": "MSNBC Anchor",
    "text": "with the reality that it is \nactually the reality that all of us \nand the voters that are probably right \noutside",
    "isRecorded": true
  },
  {
    "time": "00:51",
    "seconds": 51,
    "speaker": "MSNBC Anchor",
    "text": "of this little bubble \nthey're living in.",
    "isRecorded": true
  },
  {
    "time": "00:53",
    "seconds": 53,
    "speaker": "MSNBC Anchor",
    "text": "When you talk to folks \nhere, whether they are people \nthat work in the Republican political \napparatus or there are people who \njust wanted to come",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "MSNBC Anchor",
    "text": "and see their favorite \npresident, they seem to be living in the reality that Donald \nTrump has created.",
    "isRecorded": true
  },
  {
    "time": "01:06",
    "seconds": 66,
    "speaker": "MSNBC Anchor",
    "text": "And Donald Trump has always \nbeen very good at creating a \nreality for other people to live \nin, full of all the kinds of \nthings that he wants to be true,\neven if they aren't true.",
    "isRecorded": true
  },
  {
    "time": "01:17",
    "seconds": 77,
    "speaker": "MSNBC Anchor",
    "text": "And that's been on full \ndisplay.",
    "isRecorded": true
  },
  {
    "time": "01:18",
    "seconds": 78,
    "speaker": "MSNBC Anchor",
    "text": "I wrote something for our \nnewsletter today about the cognitive \ndissonance that is, that is happening here\nand on absolutely full",
    "isRecorded": true
  },
  {
    "time": "01:24",
    "seconds": 84,
    "speaker": "MSNBC Anchor",
    "text": "display.",
    "isRecorded": true
  },
  {
    "time": "01:26",
    "seconds": 86,
    "speaker": "MSNBC Anchor",
    "text": "And it's not just Donald \nTrump and his very long speech \nlast night where if you were a person DONALD TRUMP WAS RUNNING \nAGAIN.",
    "isRecorded": true
  },
  {
    "time": "01:36",
    "seconds": 96,
    "speaker": "MSNBC Anchor",
    "text": "IT WASN'T THE PERSON IN \nCHARGE OF THE COUNTRY AT THIS \nPOINT.",
    "isRecorded": true
  },
  {
    "time": "01:39",
    "seconds": 99,
    "speaker": "MSNBC Anchor",
    "text": "YOU HAVE ANNA-PAULINA LUNA \nSAYING THAT PEOPLE WHO WORK FOR THE PUBLIC GOOD ARE SUPPOSED TO\nPEOPLE THAT ARE WORKING FOR THE PUBLIC GOOD,",
    "isRecorded": true
  },
  {
    "time": "01:46",
    "seconds": 106,
    "speaker": "MSNBC Anchor",
    "text": "SHOULD NOT MAKE,\nSHOULD NOT BE BENEFITING OFF OF THAT MONETARILY WHEN DONALD \nTRUMP HAS $2 .2 BILLION IN THAT FIRST YEAR.",
    "isRecorded": true
  },
  {
    "time": "01:53",
    "seconds": 113,
    "speaker": "MSNBC Anchor",
    "text": "YOU HAVE SECRETARY BESSENT \ntalking about how Joe Biden was \nasleep and, you know, Donald Trump \ndoesn't sleep.",
    "isRecorded": true
  },
  {
    "time": "02:00",
    "seconds": 120,
    "speaker": "MSNBC Anchor",
    "text": "But like we've seen him \nclose his eyes in cabinet meetings.",
    "isRecorded": true
  },
  {
    "time": "02:04",
    "seconds": 124,
    "speaker": "MSNBC Anchor",
    "text": "So it is like a completely \ndifferent world in which it's being \ninhabited here and almost all,\nand almost none of the issues that the American people \nare feeling",
    "isRecorded": true
  },
  {
    "time": "02:11",
    "seconds": 131,
    "speaker": "MSNBC Anchor",
    "text": "and that they're more \nimportant they're going to be voting \non.",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "MSNBC Anchor",
    "text": "And actually pretty soon\nbecause there's this balance that are already going out around \nthe country.",
    "isRecorded": true
  },
  {
    "time": "02:19",
    "seconds": 139,
    "speaker": "MSNBC Anchor",
    "text": "Folks are going to be \nvoting and on things that Donald \nTrump and his team aren't talking \nabout.",
    "isRecorded": true
  },
  {
    "time": "02:24",
    "seconds": 144,
    "speaker": "MSNBC Anchor",
    "text": "I don't think that $5 ,000 \ndividend that probably isn't going \nanywhere you know better than I in Congress \nisn't going anywhere but those are the kinds of \nlittle things",
    "isRecorded": true
  },
  {
    "time": "02:33",
    "seconds": 153,
    "speaker": "MSNBC Anchor",
    "text": "that they're dangling out \nthere hoping against hope that something \ndifferent will happen than what we are all \nlooking at all of the historical \ntrends, the polling",
    "isRecorded": true
  },
  {
    "time": "02:41",
    "seconds": 161,
    "speaker": "MSNBC Anchor",
    "text": "and talking to voters here \non the ground and in other parts of the \ncountry.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "MSNBC Anchor",
    "text": "That's what we see.",
    "isRecorded": true
  },
  {
    "time": "02:45",
    "seconds": 165,
    "speaker": "MSNBC Anchor",
    "text": "Donald Trump wants folks to \nsee something completely, completely different out \nthere.",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "MSNBC Anchor",
    "text": "Yeah, and he's forcing his \nparty to live in that reality with him as \nwell as he forced the issue of \nhaving a convention and then forced Republicans",
    "isRecorded": true
  },
  {
    "time": "02:56",
    "seconds": 176,
    "speaker": "MSNBC Anchor",
    "text": "in tough seats to have to \nmake a decision of, okay, is it better for me \nto go and bank on MAGA turnout or \nis it better for me to stay home and \njust pretend",
    "isRecorded": true
  },
  {
    "time": "03:04",
    "seconds": 184,
    "speaker": "MSNBC Anchor",
    "text": "that it's better to go to \nany local event that I can possibly find \nbecause that is where the focus should be.",
    "isRecorded": true
  },
  {
    "time": "03:10",
    "seconds": 190,
    "speaker": "MSNBC Anchor",
    "text": "You know, David,\nwe are also currently watching the president on the ground \nin Arlington, Texas right now.",
    "isRecorded": true
  },
  {
    "time": "03:15",
    "seconds": 195,
    "speaker": "MSNBC Anchor",
    "text": "He's going to give remarks \nand meet with Medal of Honor recipients at the \nHonor Museum there.",
    "isRecorded": true
  },
  {
    "time": "03:19",
    "seconds": 199,
    "speaker": "MSNBC Anchor",
    "text": "You can see him there with \nCharlotte Jones of the Dallas Cowboys.",
    "isRecorded": true
  },
  {
    "time": "03:22",
    "seconds": 202,
    "speaker": "MSNBC Anchor",
    "text": "We're going to wait and see \nwhat he says.",
    "isRecorded": true
  },
  {
    "time": "03:25",
    "seconds": 205,
    "speaker": "MSNBC Anchor",
    "text": "And of course, if he takes \nquestions, that is always intriguing.",
    "isRecorded": true
  },
  {
    "time": "03:27",
    "seconds": 207,
    "speaker": "MSNBC Anchor",
    "text": "So we're going to keep an \neye there.",
    "isRecorded": true
  },
  {
    "time": "03:29",
    "seconds": 209,
    "speaker": "MSNBC Anchor",
    "text": "But I think the other thing\nthat I've been thinking about throughout this convention \nis the ways in which this midterm, to \nme, is a test of where the \nTrump coalition is.",
    "isRecorded": true
  },
  {
    "time": "03:38",
    "seconds": 218,
    "speaker": "MSNBC Anchor",
    "text": "Because what the White \nHouse is banking on and what some of the \nmore optimistic Republicans I talk to are \nbanking on is that the MAGA coalition \nthat makes up",
    "isRecorded": true
  },
  {
    "time": "03:46",
    "seconds": 226,
    "speaker": "MSNBC Anchor",
    "text": "that 30-some-odd percent \nthat was always baked into supporting Trump, that they are the ones that \nare going to turn out.",
    "isRecorded": true
  },
  {
    "time": "03:52",
    "seconds": 232,
    "speaker": "MSNBC Anchor",
    "text": "But I will say anecdotally,\nI have met voters who say, I voted for Trump three \ntimes and this just doesn't feel like a president that's \nmaking good",
    "isRecorded": true
  },
  {
    "time": "04:00",
    "seconds": 240,
    "speaker": "MSNBC Anchor",
    "text": "on the things that he \ncampaigned on.",
    "isRecorded": true
  },
  {
    "time": "04:02",
    "seconds": 242,
    "speaker": "MSNBC Anchor",
    "text": "And so I wonder if you \nthink the coalition is as strong as a lot of",
    "isRecorded": true
  },
  {
    "time": "04:20",
    "seconds": 260,
    "speaker": "MSNBC Anchor",
    "text": "that.",
    "isRecorded": true
  },
  {
    "time": "04:21",
    "seconds": 261,
    "speaker": "MSNBC Anchor",
    "text": "no matter what.",
    "isRecorded": true
  },
  {
    "time": "04:22",
    "seconds": 262,
    "speaker": "MSNBC Anchor",
    "text": "Democrats are going to make \nsure of that.",
    "isRecorded": true
  },
  {
    "time": "04:23",
    "seconds": 263,
    "speaker": "MSNBC Anchor",
    "text": "So we might as well get out\nof it what is possible and what's possible to get \nout of it is if we make him the \ncenterpiece and the focal point,\nnot in every race but in",
    "isRecorded": true
  },
  {
    "time": "04:32",
    "seconds": 272,
    "speaker": "MSNBC Anchor",
    "text": "most races, not in every race, but in \nmost races, then maybe it juices that \nturnout that we get when President \nTrump is on the ballot that we \nhaven't seen",
    "isRecorded": true
  },
  {
    "time": "04:41",
    "seconds": 281,
    "speaker": "MSNBC Anchor",
    "text": "in midterm elections when \nhe's not on the ballot.",
    "isRecorded": true
  },
  {
    "time": "04:43",
    "seconds": 283,
    "speaker": "MSNBC Anchor",
    "text": "The problem is that they're \nnot having a problem necessarily with Trump \nloyalists who are going to look past a lot of the \nshortcomings",
    "isRecorded": true
  },
  {
    "time": "04:52",
    "seconds": 292,
    "speaker": "MSNBC Anchor",
    "text": "in the economy and foreign \npolicy and say, you know what, he's always \nbeen our guy.",
    "isRecorded": true
  },
  {
    "time": "04:57",
    "seconds": 297,
    "speaker": "MSNBC Anchor",
    "text": "He's always been for us.\nWe're going to be there for him.",
    "isRecorded": true
  },
  {
    "time": "04:59",
    "seconds": 299,
    "speaker": "MSNBC Anchor",
    "text": "where the president and \nwhere republicans are having issues are the outer \nbands of the republican coalition \ni'm talking about you know we say this \nall the time um ali",
    "isRecorded": true
  },
  {
    "time": "05:08",
    "seconds": 308,
    "speaker": "MSNBC Anchor",
    "text": "normie republicans right \nthere to the extent they still exist yeah but \nthey do and they're conservatives \nfirst they're republicans first and \nthey're trump voters",
    "isRecorded": true
  },
  {
    "time": "05:16",
    "seconds": 316,
    "speaker": "MSNBC Anchor",
    "text": "second or third but they've \nalways stuck with the president in three \nelections because they've decided \nhe's better than whatever the democrats \nhave",
    "isRecorded": true
  },
  {
    "time": "05:23",
    "seconds": 323,
    "speaker": "MSNBC Anchor",
    "text": "on offer yeah particularly in 2024 these are the exact \nvoters that are having issues with him because \nthey were willing to put up with the \npeccadilloes as long",
    "isRecorded": true
  },
  {
    "time": "05:33",
    "seconds": 333,
    "speaker": "MSNBC Anchor",
    "text": "as he delivered on the \neconomy and they don't think he is\nand And so conventions like this, two-day rallies like this,\ntwo-hour speeches like the",
    "isRecorded": true
  },
  {
    "time": "05:40",
    "seconds": 340,
    "speaker": "MSNBC Anchor",
    "text": "one he gave last night, those are reminders \nto them of exactly what they're \nflustered with and tired of and so I don't \nnecessarily see how",
    "isRecorded": true
  },
  {
    "time": "05:52",
    "seconds": 352,
    "speaker": "MSNBC Anchor",
    "text": "that that solves the \nturnout problem unless the hope is it's the low propensity \nvoters that they get that only \nshow up in presidential years but \nagain Again,",
    "isRecorded": true
  },
  {
    "time": "06:01",
    "seconds": 361,
    "speaker": "MSNBC Anchor",
    "text": "if you're missing the \nRepublican regulars, which are an undervalued \npart of Trump's success when \nhe's been successful, then the Republicans are \nstill",
    "isRecorded": true
  },
  {
    "time": "06:09",
    "seconds": 369,
    "speaker": "MSNBC Anchor",
    "text": "going to be in trouble.",
    "isRecorded": true
  },
  {
    "time": "06:10",
    "seconds": 370,
    "speaker": "MSNBC Anchor",
    "text": "Yeah, the people who are \nhabituated to coming out as Republicans in presidential years \nwhether or not they are active \nTrump fans",
    "isRecorded": true
  },
  {
    "time": "06:17",
    "seconds": 377,
    "speaker": "MSNBC Anchor",
    "text": "or just people who say well \nI'm going to vote for the \nRepublican because the Democrat \ndoesn't feel better.",
    "isRecorded": true
  },
  {
    "time": "06:21",
    "seconds": 381,
    "speaker": "MSNBC Anchor",
    "text": "Jake, just take us inside \nwhat you're hearing from Republicans, maybe those who went,\nthose who didn't go to Dallas.",
    "isRecorded": true
  },
  {
    "time": "06:27",
    "seconds": 387,
    "speaker": "MSNBC Anchor",
    "text": "AND WHAT THEY MAKE OF WHAT \nTHEY'VE SEEN FROM THIS PRESIDENT ON \nTHE REPUBLICAN SIDE, AND THEN FOR DEMOCRATS WHO \nARE SAYING WE SEE WHAT TRUMP IS DOING \nAND WE'RE",
    "isRecorded": true
  },
  {
    "time": "06:35",
    "seconds": 395,
    "speaker": "MSNBC Anchor",
    "text": "KEEN TO LET HIM DO IT BUT \nWE'RE ALSO GOING TO PUT OUT ADS \nTALKING ABOUT COST OF living, are they getting what they \nhope to get here?",
    "isRecorded": true
  },
  {
    "time": "06:43",
    "seconds": 403,
    "speaker": "MSNBC Anchor",
    "text": "I would say what they hope \nto get, they're getting exactly \nthat, which is Donald Trump \nplastered all over television and all \nthe attention",
    "isRecorded": true
  },
  {
    "time": "06:51",
    "seconds": 411,
    "speaker": "MSNBC Anchor",
    "text": "on Donald Trump and him \nsaying he's going to send out \nthese checks, which is a tacit \nacknowledgement in my thoughts, Allie, that the economy is not good.",
    "isRecorded": true
  },
  {
    "time": "07:00",
    "seconds": 420,
    "speaker": "MSNBC Anchor",
    "text": "Affordability is not \ngetting better.",
    "isRecorded": true
  },
  {
    "time": "07:02",
    "seconds": 422,
    "speaker": "MSNBC Anchor",
    "text": "And you know,\nand you what you said is absolutely right, which is the ads they are \nputting out are not about Donald Trump.",
    "isRecorded": true
  },
  {
    "time": "07:08",
    "seconds": 428,
    "speaker": "MSNBC Anchor",
    "text": "They're about \naffordability, which is on top of every \npoll for Republicans and \nDemocrats across the country.",
    "isRecorded": true
  },
  {
    "time": "07:16",
    "seconds": 436,
    "speaker": "MSNBC Anchor",
    "text": "And what is even more \nheartening to Democrats is that the president's \npolitical operation is signaling that they're \ngoing to put out ads",
    "isRecorded": true
  },
  {
    "time": "07:24",
    "seconds": 444,
    "speaker": "MSNBC Anchor",
    "text": "with Donald Trump in it.",
    "isRecorded": true
  },
  {
    "time": "07:25",
    "seconds": 445,
    "speaker": "MSNBC Anchor",
    "text": "I mean, like you might like \nwhat this Congress has done.",
    "isRecorded": true
  },
  {
    "time": "07:29",
    "seconds": 449,
    "speaker": "MSNBC Anchor",
    "text": "You might not.",
    "isRecorded": true
  },
  {
    "time": "07:30",
    "seconds": 450,
    "speaker": "MSNBC Anchor",
    "text": "But like Every single \npublic poll and private poll indicates that he is underwater.",
    "isRecorded": true
  },
  {
    "time": "07:35",
    "seconds": 455,
    "speaker": "MSNBC Anchor",
    "text": "He is more underwater\nin the soft Republican districts that make up the outer \nedges of this Republican in \nmajority.",
    "isRecorded": true
  },
  {
    "time": "07:44",
    "seconds": 464,
    "speaker": "MSNBC Anchor",
    "text": "So, you know,\nI would say to the extent anyone is watching this and it's not \nclear to me.",
    "isRecorded": true
  },
  {
    "time": "07:48",
    "seconds": 468,
    "speaker": "MSNBC Anchor",
    "text": "I mean, maybe you guys know \nsomething I don't do.",
    "isRecorded": true
  },
  {
    "time": "07:50",
    "seconds": 470,
    "speaker": "MSNBC Anchor",
    "text": "And this poll is exactly \nwhat I'm talking about, by the way.",
    "isRecorded": true
  },
  {
    "time": "07:52",
    "seconds": 472,
    "speaker": "MSNBC Anchor",
    "text": "But I can't assume that the \nratings are that high for this stuff.",
    "isRecorded": true
  },
  {
    "time": "07:56",
    "seconds": 476,
    "speaker": "MSNBC Anchor",
    "text": "And if the idea, as Drucker \nsaid, is to drive up turnout \namong Republican faithful, you know,\nI guess that works to some extent.",
    "isRecorded": true
  },
  {
    "time": "08:06",
    "seconds": 486,
    "speaker": "MSNBC Anchor",
    "text": "But, you know, I don't see \na lot of Republican presidential \nyear voters getting super \nexcited to vote for House races, especially in a year\nin which the public",
    "isRecorded": true
  },
  {
    "time": "08:16",
    "seconds": 496,
    "speaker": "MSNBC Anchor",
    "text": "narrative is that the House has gone for \nthe GOP.",
    "isRecorded": true
  },
  {
    "time": "08:20",
    "seconds": 500,
    "speaker": "MSNBC Anchor",
    "text": "Yeah, and not super \nhelpful, too, that",
    "isRecorded": true
  },
  {
    "time": "08:35",
    "seconds": 515,
    "speaker": "MSNBC Anchor",
    "text": "to me, like it is a it is a \nfait accompli that they are going to lose.",
    "isRecorded": true
  },
  {
    "time": "08:38",
    "seconds": 518,
    "speaker": "MSNBC Anchor",
    "text": "But when you talk about the \nSenate, I think the most shocking \nturn of events has been the way\nthat Democrats went from sort of like shoulders slumped,\nreally stressed about what",
    "isRecorded": true
  },
  {
    "time": "08:46",
    "seconds": 526,
    "speaker": "MSNBC Anchor",
    "text": "the map looked like in January of 2025 to \nfast forwarding to now where \nthey're like, yeah, we actually think\nthat we see some paths to",
    "isRecorded": true
  },
  {
    "time": "08:53",
    "seconds": 533,
    "speaker": "MSNBC Anchor",
    "text": "flip the Senate.",
    "isRecorded": true
  },
  {
    "time": "08:54",
    "seconds": 534,
    "speaker": "MSNBC Anchor",
    "text": "Do you still think that \nthat is too bullish of a view?",
    "isRecorded": true
  },
  {
    "time": "08:57",
    "seconds": 537,
    "speaker": "MSNBC Anchor",
    "text": "Or where are you right now? \nLook, I don't think it's too \nbullish.",
    "isRecorded": true
  },
  {
    "time": "09:00",
    "seconds": 540,
    "speaker": "MSNBC Anchor",
    "text": "I just think that if you're \ntrying to figure out what's going to happen \non November 3rd, you should understand what \na tall task it is.",
    "isRecorded": true
  },
  {
    "time": "09:05",
    "seconds": 545,
    "speaker": "MSNBC Anchor",
    "text": "I mean, let's look back at \n2018.",
    "isRecorded": true
  },
  {
    "time": "09:07",
    "seconds": 547,
    "speaker": "MSNBC Anchor",
    "text": "Democrats win 40 House \nseats.",
    "isRecorded": true
  },
  {
    "time": "09:09",
    "seconds": 549,
    "speaker": "MSNBC Anchor",
    "text": "It's a complete wipeout for \nRepublicans in the House.",
    "isRecorded": true
  },
  {
    "time": "09:12",
    "seconds": 552,
    "speaker": "MSNBC Anchor",
    "text": "But on net, Republicans \ngained two Senate seats, and Donald Trump campaigning in red states was very \nhelpful to his party.",
    "isRecorded": true
  },
  {
    "time": "09:21",
    "seconds": 561,
    "speaker": "MSNBC Anchor",
    "text": "John Tester held on in \nMontana, but that was unique to that \ncampaign.",
    "isRecorded": true
  },
  {
    "time": "09:27",
    "seconds": 567,
    "speaker": "MSNBC Anchor",
    "text": "And so when you're looking \nat a gauntlet like Alaska, Texas, Ohio, \nmaybe Kansas.",
    "isRecorded": true
  },
  {
    "time": "09:34",
    "seconds": 574,
    "speaker": "MSNBC Anchor",
    "text": "I'm leaving a red state out.",
    "isRecorded": true
  },
  {
    "time": "09:37",
    "seconds": 577,
    "speaker": "MSNBC Anchor",
    "text": "And Maine is something \nSusan Collins could hang on to.",
    "isRecorded": true
  },
  {
    "time": "09:41",
    "seconds": 581,
    "speaker": "MSNBC Anchor",
    "text": "The fact that Democrats are\nin a good position in Georgia, but also a tough state.",
    "isRecorded": true
  },
  {
    "time": "09:45",
    "seconds": 585,
    "speaker": "MSNBC Anchor",
    "text": "That just shows you how \nwell they're going to have to perform.",
    "isRecorded": true
  },
  {
    "time": "09:49",
    "seconds": 589,
    "speaker": "MSNBC Anchor",
    "text": "It also shows you how \nvulnerable Republicans are when we can \nless than what eight weeks \nbefore Election Day.",
    "isRecorded": true
  },
  {
    "time": "09:57",
    "seconds": 597,
    "speaker": "MSNBC Anchor",
    "text": "We can talk about a \nrealistic path to Democrats winning \ncontrol of the Senate when six \nmonths ago we would have said maybe they can win a couple of \nseats,",
    "isRecorded": true
  },
  {
    "time": "10:06",
    "seconds": 606,
    "speaker": "MSNBC Anchor",
    "text": "but we didn't see a \nmajority in sight.",
    "isRecorded": true
  },
  {
    "time": "10:08",
    "seconds": 608,
    "speaker": "MSNBC Anchor",
    "text": "I think that's the more \nstriking thing,",
    "isRecorded": true
  }
],
  "VbaDBkXyejo": [
  {
    "time": "00:01",
    "seconds": 1,
    "speaker": "MSNBC Anchor",
    "text": "WE'LL TELL YOU ABOUT DONALD\nTRUMP'S RETRIBUTION CAMPAIGN AGAINST HIS PERCEIVED \nPOLITICAL ENEMIES.",
    "isRecorded": true
  },
  {
    "time": "00:05",
    "seconds": 5,
    "speaker": "MSNBC Anchor",
    "text": "IT'S BEING SPEARHEADED BY \nHIS DEPARTMENT OF JUSTICE AND JOE THE D .O .J.",
    "isRecorded": true
  },
  {
    "time": "00:13",
    "seconds": 13,
    "speaker": "MSNBC Anchor",
    "text": "FAR-FRECH,\nSO-CALLED GRAND CONSPIRACY CASE BASED IN SOUTH FLORIDA HAS \nRESIGNED HIS POSITION WE'RE LEARNING \nTODAY.",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "MSNBC Anchor",
    "text": "TO GENEVA TELLING THE \nASSOCIATED PRESS, QUOTE, I DID IN FACT RESIGN, CALLING IT A QUOTE HONOR \nAND PRIVILEGE TO SERVE TRUMP IN THE DOJ.",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "MSNBC Anchor",
    "text": "HE DECLINED TO COMMENT ON \nTHE CIRCUMSTANCES OF HIS DEPARTURE.",
    "isRecorded": true
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "MSNBC Anchor",
    "text": "HELMEN, THIS IS LIKE THE I \nDON'T THINK IT'S THE WHITE WHEEL, RIGHT?",
    "isRecorded": true
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "MSNBC Anchor",
    "text": "FIGURING OUT HOW TO \nPROSECUTE DIRECTOR JOHN BRENNAN AND \nOTHERS THAT THEY VIEW AS PART OF,\nI DON'T KNOW WHAT, THE GRAND CONSPIRACY TWO,\nTHREE IT'S A TRIP DOWN A",
    "isRecorded": true
  },
  {
    "time": "00:42",
    "seconds": 42,
    "speaker": "MSNBC Anchor",
    "text": "RABBIT FOR DONALD TRUMP, IT'S THE \nWAY I WAIL.",
    "isRecorded": true
  },
  {
    "time": "00:45",
    "seconds": 45,
    "speaker": "MSNBC Anchor",
    "text": "FOR ANYBODY WHO HELPS HIM,\nIT'S JUST A TRIP DOWN A RABBIT HOLE WHERE IF YOU GO FAR \nDECISIONS, AND YOU KNOW, OF YOUR LAW LICENSE.",
    "isRecorded": true
  },
  {
    "time": "00:52",
    "seconds": 52,
    "speaker": "MSNBC Anchor",
    "text": "YOU KNOW, THIS IS, WE \nDON'T, JUDGE VEGENEVA HAS NOT SAID \nANYTHING AS TO WHY.",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "MSNBC Anchor",
    "text": "IT COULD BE AT 81 YEARS \nOLD, HE LOOKED UP AND WAS LIKE \nTHIS IS MORE OF A, THIS WAS A MISTAKE FOR ME \nTO HAVE TAKEN THIS CASE BECAUSE THERE IS \nNO THERE",
    "isRecorded": true
  },
  {
    "time": "01:05",
    "seconds": 65,
    "speaker": "MSNBC Anchor",
    "text": "THERE AND THIS IS JUST \nGOING TO BE A WOOD CHIPPER THAT I'M FED \nINTO.",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "MSNBC Anchor",
    "text": "IF I DON'T END UP WITH \nINDICTING JOHN BRENNAN AND PROSECUTING HIM, I'M GOING TO BE IN DONALD \nTRUMP'S CROSSHAIRS, WHO NEEDS THAT AT THE AGE \nOF 81,",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "MSNBC Anchor",
    "text": "AND IF I DO TRY TO ACTUALLY \nPROSECUTE HIM, I'M GOING TO END UP WHERE \nRUDU GIULIOTTI IS, WHICH IS ULTIMATELY \nDISBARRED.",
    "isRecorded": true
  },
  {
    "time": "01:21",
    "seconds": 81,
    "speaker": "MSNBC Anchor",
    "text": "EVEN IN 81,\nIT'S NOT A GREAT THING TO HAVE AS PART OF YOUR record.",
    "isRecorded": true
  },
  {
    "time": "01:26",
    "seconds": 86,
    "speaker": "MSNBC Anchor",
    "text": "It's not a great,\nhe had Joe DeVangeva once had a relatively respectable \ncareer in law enforcement and in the legal realm.",
    "isRecorded": true
  },
  {
    "time": "01:32",
    "seconds": 92,
    "speaker": "MSNBC Anchor",
    "text": "He doesn't need that stain \nto be the last thing that that he's remembered \nfor in public.",
    "isRecorded": true
  },
  {
    "time": "01:36",
    "seconds": 96,
    "speaker": "MSNBC Anchor",
    "text": "So, you know, this is kind \nof a lose-lose.",
    "isRecorded": true
  },
  {
    "time": "01:39",
    "seconds": 99,
    "speaker": "MSNBC Anchor",
    "text": "You would like to think\nthat he could have seen that coming a mile away, but I think he got,\nit feels like he got into THIS THING AND SAID THERE \nIS NO WAY",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "MSNBC Anchor",
    "text": "THAT THIS IS GOING TO END \nWELL FOR ME.",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "MSNBC Anchor",
    "text": "SO I THINK WHAT I WILL DO \nNOW IS TRYING TO THE SUNSET AND \nSPEND MORE TIME WITH MY FAMILY.",
    "isRecorded": true
  },
  {
    "time": "01:55",
    "seconds": 115,
    "speaker": "MSNBC Anchor",
    "text": "WELL, AND THE CAREER THE \nFEDERAL PROSECUTOR WHO LEFT THE \nOFFICE BECAUSE SHE DIDN'T FIND \nFACTS TO SUPPORT A PROSECUTION OF \nDIRECTOR",
    "isRecorded": true
  },
  {
    "time": "02:06",
    "seconds": 126,
    "speaker": "MSNBC Anchor",
    "text": "BRENNAN OR IN THIS GRAND \nCONSPIRACY, WAS TRUSTED ENOUGH TO IT WAS A CAREER PROSECUTOR \nHELD IN VERY GOOD STANDING UP UNTIL THE POINT \nWHERE SHE",
    "isRecorded": true
  },
  {
    "time": "02:17",
    "seconds": 137,
    "speaker": "MSNBC Anchor",
    "text": "REFUSED TO PARTICIPATE IN \nTHE GRAND CONSPIRACY.",
    "isRecorded": true
  },
  {
    "time": "02:19",
    "seconds": 139,
    "speaker": "MSNBC Anchor",
    "text": "YES, AND, YOU KNOW, LIKE I SAID, ONE OF THE REASONS \nwhy Judge Genova should have seen this \ncoming a mile away.",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "MSNBC Anchor",
    "text": "That was an early clue that \nso you were being handed a \nwhite elephant of a case here that was \ngoing to end up not being good for \nyou,",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "MSNBC Anchor",
    "text": "no matter what you did.",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "MSNBC Anchor",
    "text": "But, again, Godspeed to Joe \nDeGeneva.",
    "isRecorded": true
  },
  {
    "time": "02:37",
    "seconds": 157,
    "speaker": "MSNBC Anchor",
    "text": "I think in the end he has \nserved probably the cause of justice by \ndeciding to step away.",
    "isRecorded": true
  },
  {
    "time": "02:41",
    "seconds": 161,
    "speaker": "MSNBC Anchor",
    "text": "One of the things that's \nhappening down here is that it's like a bank shot, \nright?",
    "isRecorded": true
  },
  {
    "time": "02:46",
    "seconds": 166,
    "speaker": "MSNBC Anchor",
    "text": "They've got Judge Aileen \nCANNON, WHO THEY HOPE TO GET IN \nFRONT OF IN THAT DISTRICT,\nTHAT FORK PIERCE DISTRICT.",
    "isRecorded": true
  },
  {
    "time": "02:52",
    "seconds": 172,
    "speaker": "MSNBC Anchor",
    "text": "AND THEN THEY'VE GOT THIS \nVERY COMPLIANT OFFICE.",
    "isRecorded": true
  },
  {
    "time": "02:54",
    "seconds": 174,
    "speaker": "MSNBC Anchor",
    "text": "THERE'S THE U .S.",
    "isRecorded": true
  },
  {
    "time": "02:55",
    "seconds": 175,
    "speaker": "MSNBC Anchor",
    "text": "ATTORNEY I THINK FOR THE \nSOUTHERN DISTRICT OF FLORIDA, SOMEONE WHO GOES ON \nMAGA-FRIENDLY MEDIA AND TALKS OPENLY ABOUT THE \nCASE.",
    "isRecorded": true
  },
  {
    "time": "03:01",
    "seconds": 181,
    "speaker": "MSNBC Anchor",
    "text": "CAROLINE LEVITT,\nBLESS HER LITTLE HEART BEFORE SHE RESIGNED, WENT TO THE PODIUM AND \nDESCRIBED THE GRAND CONSPIRACY AS SHE SAW \nIT.",
    "isRecorded": true
  },
  {
    "time": "03:08",
    "seconds": 188,
    "speaker": "MSNBC Anchor",
    "text": "IT WAS LIKE ONE OF THOSE \nKERRY MATHISON MAPS WITH A BUNCH \nOF RED STRING TIED HERE,\nTHERE AND EVERYWHERE, NO INSULT THAT THEY WANT TO \nCARRY MATHESON.",
    "isRecorded": true
  },
  {
    "time": "03:14",
    "seconds": 194,
    "speaker": "MSNBC Anchor",
    "text": "BUT THIS IS SOMETHING THAT IS PREDICATED ON NONSENSE AND \nTHINGS THAT JOHN DURHAM AND BILL BARR AND \nOTHERS HAVE PLENTY OF TIME TO LOOK INTO AND \nFOUND NOTHING.",
    "isRecorded": true
  },
  {
    "time": "03:23",
    "seconds": 203,
    "speaker": "MSNBC Anchor",
    "text": "I HAVE THIS IMAGE IN MY \nHEAD OF KERRY MATHISON,\nONE OF HER PEAK MANIC EPISODES, LOOKING UP AT THE KERRY \nMATHISON, LOOKING They're nuts.",
    "isRecorded": true
  },
  {
    "time": "03:35",
    "seconds": 215,
    "speaker": "MSNBC Anchor",
    "text": "This is wacko.\nWackadoo, yeah.",
    "isRecorded": true
  },
  {
    "time": "03:37",
    "seconds": 217,
    "speaker": "MSNBC Anchor",
    "text": "It's, you know, what's to \nsay about it?",
    "isRecorded": true
  },
  {
    "time": "03:40",
    "seconds": 220,
    "speaker": "MSNBC Anchor",
    "text": "Well, we've got two more \nyears to ride this out.",
    "isRecorded": true
  },
  {
    "time": "03:42",
    "seconds": 222,
    "speaker": "MSNBC Anchor",
    "text": "But I guess what's to say\nabout it today is too wacky for Joe WE'LL BE TALKING\nABOUT IT AGAIN IN FUTURE IF THEY CONTINUE TO PURSUE IT BUT \nAT THIS",
    "isRecorded": true
  },
  {
    "time": "03:50",
    "seconds": 230,
    "speaker": "MSNBC Anchor",
    "text": "MOMENT I THINK WE HAVE TO \nSAY IS YOU KNOW JODA GENEVA HAS \nLEFT THE CHAT HAS LEFT THE CHAT I \nALSO WILL I WILL SAY THIRD DISTRICT \nOF WISCONSIN,",
    "isRecorded": true
  },
  {
    "time": "03:59",
    "seconds": 239,
    "speaker": "MSNBC Anchor",
    "text": "MOST IMPORTANT THING TO KNOW ABOUT THAT IS WHERE\nLA CROSSE WISCONSIN IS.",
    "isRecorded": true
  },
  {
    "time": "04:03",
    "seconds": 243,
    "speaker": "MSNBC Anchor",
    "text": "YOU KNOW WHAT'S IN LA \nCROSSE WISCONSIN?",
    "isRecorded": true
  },
  {
    "time": "04:04",
    "seconds": 244,
    "speaker": "MSNBC Anchor",
    "text": "THE WORLD'S LARGEST \nSIX-PACK OF BEER AT THE G HEILMAN BREWERY.",
    "isRecorded": true
  },
  {
    "time": "04:10",
    "seconds": 250,
    "speaker": "MSNBC Anchor",
    "text": "THAT'S REALLY, REALLY, \nREALLY, REALLY, I WISH I KNEW THAT GOING IN.",
    "isRecorded": true
  },
  {
    "time": "04:12",
    "seconds": 252,
    "speaker": "MSNBC Anchor",
    "text": "YOU'RE NEVER ONE TO NOT \nPARTICIPATE.",
    "isRecorded": true
  },
  {
    "time": "04:15",
    "seconds": 255,
    "speaker": "MSNBC Anchor",
    "text": "WHY DON'T YOU JUMP IN WITH \nWE ARE TRYING TO KEEP THAT SERIOUSLY.",
    "isRecorded": true
  },
  {
    "time": "04:18",
    "seconds": 258,
    "speaker": "MSNBC Anchor",
    "text": "SHE'S GREAT THOUGH.",
    "isRecorded": true
  },
  {
    "time": "04:21",
    "seconds": 261,
    "speaker": "MSNBC Anchor",
    "text": "I FEEL PRETTY CONFIDENT \nTHAT SHE WILL, SHE WOULD IF ASK, GUARANTEE THAT THAT STATUS\nOF THE WORLD'S BIGGEST SIX back will remain in \nlacrosse as long as she is.",
    "isRecorded": true
  },
  {
    "time": "04:31",
    "seconds": 271,
    "speaker": "MSNBC Anchor",
    "text": "We'll have her back, we'll \nput it to her.",
    "isRecorded": true
  },
  {
    "time": "04:32",
    "seconds": 272,
    "speaker": "MSNBC Anchor",
    "text": "When we come back,\nwe will together be joined",
    "isRecorded": true
  }
],
  "JT3WXqUTMJU": [
  {
    "time": "00:01",
    "seconds": 1,
    "speaker": "MSNBC Anchor",
    "text": "the co-host of the\nweeknight here on MSNOW, Luke Russert in Dallas.",
    "isRecorded": true
  },
  {
    "time": "00:04",
    "seconds": 4,
    "speaker": "MSNBC Anchor",
    "text": "MSNOW analyst and economics \neditor at The Bulwark, Catherine \nRampell.",
    "isRecorded": true
  },
  {
    "time": "00:07",
    "seconds": 7,
    "speaker": "MSNBC Anchor",
    "text": "Professor of public policy \nand economics at the University of \nMichigan, Betsy THANK YOU FOR JOINING \nUS.",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "MSNBC Anchor",
    "text": "IT'S A GREAT JOB TODAY.\nIT'S A GREAT JOB TODAY.",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "MSNBC Anchor",
    "text": "THE JOURNALIST AND AUTHOR \nOF BLOW THE STACK ON SUBSTACK, CHARLES BLOW.",
    "isRecorded": true
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "MSNBC Anchor",
    "text": "KATHERINE,\nFIRST TO YOU because we cited you in the intro.",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "MSNBC Anchor",
    "text": "Let's just talk Turkey here.",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "MSNBC Anchor",
    "text": "What is the president \npromising and how would we pay for it?",
    "isRecorded": true
  },
  {
    "time": "00:23",
    "seconds": 23,
    "speaker": "MSNBC Anchor",
    "text": "I appreciated that the vice \npresident J .D.",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "MSNBC Anchor",
    "text": "Vance tried to make it \nsound like some really thought \nthrough policy.",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "MSNBC Anchor",
    "text": "It was going to be paid for \nby tariff revenue.",
    "isRecorded": true
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "MSNBC Anchor",
    "text": "There'd be some kind of \nsalary cap, but like walk us through \nwhat you actually see in this promise.",
    "isRecorded": true
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "MSNBC Anchor",
    "text": "Well, usually one of my \nroles as a journalist is to not \nspend more time analyzing a Trump \nidea than Trump himself has spent and coming up with that idea.",
    "isRecorded": true
  },
  {
    "time": "00:45",
    "seconds": 45,
    "speaker": "MSNBC Anchor",
    "text": "But since lots of other \npeople, lots of credulous news \noutlets and various Trump allies \nare treating this as a real \nproposal, I guess we have to pretend \nit is",
    "isRecorded": true
  },
  {
    "time": "00:53",
    "seconds": 53,
    "speaker": "MSNBC Anchor",
    "text": "or at least debunk it to \nthe extent that we can.",
    "isRecorded": true
  },
  {
    "time": "00:56",
    "seconds": 56,
    "speaker": "MSNBC Anchor",
    "text": "And the answer to your \nquestion is, we have no idea how he's \ngoing to pay for it.",
    "isRecorded": true
  },
  {
    "time": "01:00",
    "seconds": 60,
    "speaker": "MSNBC Anchor",
    "text": "If you look at the numbers,\nthis would amount to something like $1 .2, $1 .3 trillion.",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "MSNBC Anchor",
    "text": "Just for comparison's sake,\nthe entire federal budget is about $7 trillion.",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "MSNBC Anchor",
    "text": "So look, there's no way you \ncan raise spending by that much.",
    "isRecorded": true
  },
  {
    "time": "01:21",
    "seconds": 81,
    "speaker": "MSNBC Anchor",
    "text": "And there's no way you can \npay for JD Vance suggested that maybe it would be paid \nfor via tariff revenue or \nsomething.",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "MSNBC Anchor",
    "text": "Tariff revenue is like,\nmaybe a 10th of that amount this year based on CBO numbers.",
    "isRecorded": true
  },
  {
    "time": "01:36",
    "seconds": 96,
    "speaker": "MSNBC Anchor",
    "text": "So it's just not plausible.",
    "isRecorded": true
  },
  {
    "time": "01:38",
    "seconds": 98,
    "speaker": "MSNBC Anchor",
    "text": "And I feel a little bit \nlike we're all goldfish where we pretend every few \nmonths that this, uh, this little voter bribe \nthat Donald",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "MSNBC Anchor",
    "text": "Trump wants to offer is \nreally a real policy.",
    "isRecorded": true
  },
  {
    "time": "01:52",
    "seconds": 112,
    "speaker": "MSNBC Anchor",
    "text": "And it's going to happen.",
    "isRecorded": true
  },
  {
    "time": "01:53",
    "seconds": 113,
    "speaker": "MSNBC Anchor",
    "text": "And you have a bunch of \nRepublicans circling the wagons and they don't \nanswer questions about any of this stuff,\nabout how it's going to be",
    "isRecorded": true
  },
  {
    "time": "01:59",
    "seconds": 119,
    "speaker": "MSNBC Anchor",
    "text": "paid for or anything else because \nthey know it's not going to materialize and as \nyou point out if they wanted to do this \nthey could",
    "isRecorded": true
  },
  {
    "time": "02:06",
    "seconds": 126,
    "speaker": "MSNBC Anchor",
    "text": "already do it which tells \nyou enough about how plausible this \nidea is yeah we'll get to the Capitol \nHill legislative fact-check on why this \nisn't going to happen",
    "isRecorded": true
  },
  {
    "time": "02:15",
    "seconds": 135,
    "speaker": "MSNBC Anchor",
    "text": "in a second, but I also just want to \nplay how the president says that this would work.",
    "isRecorded": true
  },
  {
    "time": "02:20",
    "seconds": 140,
    "speaker": "MSNBC Anchor",
    "text": "And Betsy,\nwe can talk about it on the other side.",
    "isRecorded": true
  },
  {
    "time": "02:22",
    "seconds": 142,
    "speaker": "MSNBC Anchor",
    "text": "Watch that.\nWhy not just give the money I'll tell you what,\nbecause the Democrats can't do it because with them, it's \nnegative growth.",
    "isRecorded": true
  },
  {
    "time": "02:33",
    "seconds": 153,
    "speaker": "MSNBC Anchor",
    "text": "With us, it's so positive.\nSo we're taking in $21 trillion.",
    "isRecorded": true
  },
  {
    "time": "02:38",
    "seconds": 158,
    "speaker": "MSNBC Anchor",
    "text": "No country's ever taken in \nanywhere near that it's four or five \ntimes higher than the next one all \nbecause of that beautiful word that \nyou",
    "isRecorded": true
  },
  {
    "time": "02:45",
    "seconds": 165,
    "speaker": "MSNBC Anchor",
    "text": "and i love more than most \nothers tariffs so we'll leave aside the political realities for \na moment because i really want luke \nto talk",
    "isRecorded": true
  },
  {
    "time": "02:53",
    "seconds": 173,
    "speaker": "MSNBC Anchor",
    "text": "about I DON'T KNOW ABOUT \nHIS OLD BEAT UP ON THE HILL.",
    "isRecorded": true
  },
  {
    "time": "02:55",
    "seconds": 175,
    "speaker": "MSNBC Anchor",
    "text": "BUT WHEN THE PRESIDENT IS \nTALKING ABOUT WE'RE TAKING IN $21 \nTRILLION AND KATHRYN IS DOING THE BACK OF THE \nTHE NAPKIN MATH ON THAT JUST BEING A DROP IN \nTHE BUCKET TO",
    "isRecorded": true
  },
  {
    "time": "03:02",
    "seconds": 182,
    "speaker": "MSNBC Anchor",
    "text": "ACTUALLY BE ABLE TO PAY FOR \nTHIS.",
    "isRecorded": true
  },
  {
    "time": "03:03",
    "seconds": 183,
    "speaker": "MSNBC Anchor",
    "text": "I MEAN, THIS IS THE SAME \nPARTY THAT SAID LET'S EXTEND THE TAX CUTS \nPERMANENTLY BUT MAKE IT COST $0 BECAUSE OF SENATE \nMAGIC MATH.",
    "isRecorded": true
  },
  {
    "time": "03:11",
    "seconds": 191,
    "speaker": "MSNBC Anchor",
    "text": "WHAT DO YOU THINK ABOUT THIS?",
    "isRecorded": true
  },
  {
    "time": "03:13",
    "seconds": 193,
    "speaker": "MSNBC Anchor",
    "text": "LOOK, YEAH,\nI THINK I WILL FOLLOW UP FIRST OF ALL ON SOMETHING THAT KATHERINE \nSAID.",
    "isRecorded": true
  },
  {
    "time": "03:18",
    "seconds": 198,
    "speaker": "MSNBC Anchor",
    "text": "WE'RE TALKING ABOUT THIS \nWhich I think is basically what President \nTrump wants, is us just to talk about \nthe potential, continue to dangle in front \nof people.",
    "isRecorded": true
  },
  {
    "time": "03:27",
    "seconds": 207,
    "speaker": "MSNBC Anchor",
    "text": "Maybe they'll get $5 ,000.\nThey're not going to get $5 ,000.",
    "isRecorded": true
  },
  {
    "time": "03:30",
    "seconds": 210,
    "speaker": "MSNBC Anchor",
    "text": "Did you see what happened \nto the bond markets recently?",
    "isRecorded": true
  },
  {
    "time": "03:33",
    "seconds": 213,
    "speaker": "MSNBC Anchor",
    "text": "Why is the bond markets,\nwhy do we see yields shooting up as high as they are?",
    "isRecorded": true
  },
  {
    "time": "03:38",
    "seconds": 218,
    "speaker": "MSNBC Anchor",
    "text": "Because the market's \ngetting spooked by how much the government \nis borrowing.",
    "isRecorded": true
  },
  {
    "time": "03:43",
    "seconds": 223,
    "speaker": "MSNBC Anchor",
    "text": "So this would involve more \nborrowing.",
    "isRecorded": true
  },
  {
    "time": "03:45",
    "seconds": 225,
    "speaker": "MSNBC Anchor",
    "text": "If he thinks that he's \nbringing in so much money, he should be able to turn \nour debt around, our deficits around and calm those bond markets \ndown,",
    "isRecorded": true
  },
  {
    "time": "03:54",
    "seconds": 234,
    "speaker": "MSNBC Anchor",
    "text": "which would help people out because do you know what \nhappens when yields go up on RATE \nGOES UP, SO PEOPLE ARE FACING HIGHER \nMORTGAGE RATES.",
    "isRecorded": true
  },
  {
    "time": "04:03",
    "seconds": 243,
    "speaker": "MSNBC Anchor",
    "text": "HE COULD GIVE THEM BACK \nHUNDREDS OF DOLLARS BY BEING FISCALLY RESPONSIBLE IN A WAY THAT \nWOULD BRING RATES DOWN.",
    "isRecorded": true
  },
  {
    "time": "04:10",
    "seconds": 250,
    "speaker": "MSNBC Anchor",
    "text": "HE CAN'T ORDER THE THE FED \nTO LOWER SHORT-TERM RATES AND HAVE \nTHAT MAGICALLY TRANSLATE INTO LONG, YOU \nKNOW, A LOWER RATE ON A 30-YEAR \nMORTGAGE WHEN",
    "isRecorded": true
  },
  {
    "time": "04:21",
    "seconds": 261,
    "speaker": "MSNBC Anchor",
    "text": "PEOPLE SEE THE FED CAN'T GET INFLATION \nBACK UNDER 3%.",
    "isRecorded": true
  },
  {
    "time": "04:29",
    "seconds": 269,
    "speaker": "MSNBC Anchor",
    "text": "SO THIS WHOLE MACROECONOMIC \nENVIRONMENT DOESN'T MAKE I DON'T WANT TO MAKE \nANY SENSE WITH HIS PROPOSAL OF HOW \nGREAT THINGS ARE.",
    "isRecorded": true
  },
  {
    "time": "04:37",
    "seconds": 277,
    "speaker": "MSNBC Anchor",
    "text": "IF THINGS WERE GREAT, \nPRICES WOULD BE LOWER.",
    "isRecorded": true
  },
  {
    "time": "04:41",
    "seconds": 281,
    "speaker": "MSNBC Anchor",
    "text": "IF THINGS WERE GREAT, \nPRICES WOULD BE LOWER.",
    "isRecorded": true
  },
  {
    "time": "04:44",
    "seconds": 284,
    "speaker": "MSNBC Anchor",
    "text": "IF THINGS WERE GREAT,\nTHE I THINK THE YIELD ON A 30-YEAR YIELD WOULD BE LOWER.",
    "isRecorded": true
  },
  {
    "time": "04:48",
    "seconds": 288,
    "speaker": "MSNBC Anchor",
    "text": "THE YIELD ON A 30-YEAR BOND \nWOULD BE LOWER.",
    "isRecorded": true
  },
  {
    "time": "04:50",
    "seconds": 290,
    "speaker": "MSNBC Anchor",
    "text": "THE OTHER THING I WAS GOING \nTO SAY, BETSY, THAT STRIKES ME IS IF \nYOU'RE THE FED CHAIR WHO KNOWS THAT YOU'VE GOT A \nPRESIDENT THAT REALLY",
    "isRecorded": true
  },
  {
    "time": "04:56",
    "seconds": 296,
    "speaker": "MSNBC Anchor",
    "text": "WANTS YOU TO LOWER RATES \nBUT ALL THE DATA THAT YOU'RE LOOKING AT IS THAT \nWE'RE IN A VOLATILE ECONOMIC MOMENT AND YOU \nHEAR HIM THEN SAY,",
    "isRecorded": true
  },
  {
    "time": "05:02",
    "seconds": 302,
    "speaker": "MSNBC Anchor",
    "text": "AND $5 ,000 CHECKS ARE \nCOMING TO FOLKS.",
    "isRecorded": true
  },
  {
    "time": "05:04",
    "seconds": 304,
    "speaker": "MSNBC Anchor",
    "text": "PUT ASIDE THE FACT THAT'S \nNOT GOING TO HAPPEN.",
    "isRecorded": true
  },
  {
    "time": "05:06",
    "seconds": 306,
    "speaker": "MSNBC Anchor",
    "text": "WHAT ARE YOU SAYING IF \nYOU'RE THE FED CHAIR KNOWING THAT'S \nYOUR LANDSCAPE, BETSY?",
    "isRecorded": true
  },
  {
    "time": "05:11",
    "seconds": 311,
    "speaker": "MSNBC Anchor",
    "text": "WELL, THAT'S KIND OF THE \nIRONY, RIGHT?",
    "isRecorded": true
  },
  {
    "time": "05:13",
    "seconds": 313,
    "speaker": "MSNBC Anchor",
    "text": "IS IT EVEN IF LET'S IMAGINE \nHE SENDS $5 ,000 CHECKS OUT THE FED CHAIR HAS NO CHOICE \nBUT",
    "isRecorded": true
  },
  {
    "time": "05:23",
    "seconds": 323,
    "speaker": "MSNBC Anchor",
    "text": "TO RAISE INTEREST RATES TO \nMAKE SURE THAT NOBODY SPENDS ANY \nOF THAT $5 ,000 BECAUSE \nOTHERWISE IT WOULD BE SUPER \nINFLATIONARY, LOOK, THE THING",
    "isRecorded": true
  },
  {
    "time": "05:32",
    "seconds": 332,
    "speaker": "MSNBC Anchor",
    "text": "IS, SOME ECONOMISTS WERE\nARGUING WHEN BIDEN SENT OUT THAT FINAL ROUND OF COVID \nCHECKS THAT IT WOULD SPIKE \nINFLATION.",
    "isRecorded": true
  },
  {
    "time": "05:41",
    "seconds": 341,
    "speaker": "MSNBC Anchor",
    "text": "AND YOU KNOW THEY WERE \nRIGHT AND BIDEN SHOULD HAVE LISTENED TO \nTHEM.",
    "isRecorded": true
  },
  {
    "time": "05:45",
    "seconds": 345,
    "speaker": "MSNBC Anchor",
    "text": "RIGHT NOW,\nIF TRUMP SENT OUT $5 ,000 CHECKS IT WOULD BE INFLATIONARY\nAND I THINK THE FED IS SO ON TOP OF THIS THAT THEY WOULD \nCOUNTERACT",
    "isRecorded": true
  },
  {
    "time": "05:55",
    "seconds": 355,
    "speaker": "MSNBC Anchor",
    "text": "ANY VALUE OF THAT BY \nRAISING RATES IN A WAY THAT WOULD MEAN \nPEOPLE'S PRICES WOULD GO, WHAT THEY PAY FOR MONEY \nWOULD GO UP.",
    "isRecorded": true
  },
  {
    "time": "06:01",
    "seconds": 361,
    "speaker": "MSNBC Anchor",
    "text": "LUKE, THE SMART ECONOMIST\nand economic-minded friends of ours on the panel have \nhandled why economically this would \nbe a bad look and probably won't \nhappen.",
    "isRecorded": true
  },
  {
    "time": "06:11",
    "seconds": 371,
    "speaker": "MSNBC Anchor",
    "text": "But legislatively,\nyou and I are the kids around Congress.",
    "isRecorded": true
  },
  {
    "time": "06:14",
    "seconds": 374,
    "speaker": "MSNBC Anchor",
    "text": "And The fact that the \npresident is not just floating this, but he's floating it\nwith Republican majorities that he's saying he can \nonly do it if he has.",
    "isRecorded": true
  },
  {
    "time": "06:22",
    "seconds": 382,
    "speaker": "MSNBC Anchor",
    "text": "He has it.",
    "isRecorded": true
  },
  {
    "time": "06:24",
    "seconds": 384,
    "speaker": "MSNBC Anchor",
    "text": "And also we've also got \nreporting at MS now that he blindsided the \nmajority",
    "isRecorded": true
  },
  {
    "time": "06:42",
    "seconds": 402,
    "speaker": "MSNBC Anchor",
    "text": "a live show.",
    "isRecorded": true
  },
  {
    "time": "06:43",
    "seconds": 403,
    "speaker": "MSNBC Anchor",
    "text": "And this is for Trump's \nmidterm convention, Trump-a-palooza thing.",
    "isRecorded": true
  },
  {
    "time": "06:46",
    "seconds": 406,
    "speaker": "MSNBC Anchor",
    "text": "And who's not here?",
    "isRecorded": true
  },
  {
    "time": "06:47",
    "seconds": 407,
    "speaker": "MSNBC Anchor",
    "text": "John Thune, the Senate \nmajority leader, right?",
    "isRecorded": true
  },
  {
    "time": "06:50",
    "seconds": 410,
    "speaker": "MSNBC Anchor",
    "text": "The people who are in the \nleadership positions in Congress to be able to \ninstitute",
    "isRecorded": true
  },
  {
    "time": "07:08",
    "seconds": 428,
    "speaker": "MSNBC Anchor",
    "text": "Where it's coming from is\nthat Donald Trump has mastered the art of speaking to the low \ninformation voter.",
    "isRecorded": true
  },
  {
    "time": "07:14",
    "seconds": 434,
    "speaker": "MSNBC Anchor",
    "text": "So if you watch this \nnetwork, you're going to hear this \nand you're hearing these wonderful \neconomists, you're hearing people who \nhave expertise",
    "isRecorded": true
  },
  {
    "time": "07:20",
    "seconds": 440,
    "speaker": "MSNBC Anchor",
    "text": "in the field say this is \ncrazy.",
    "isRecorded": true
  },
  {
    "time": "07:22",
    "seconds": 442,
    "speaker": "MSNBC Anchor",
    "text": "YOU KNOW WHO GIVES OUT $5 \n,000 AROUND ELECTION TIME?",
    "isRecorded": true
  },
  {
    "time": "07:24",
    "seconds": 444,
    "speaker": "MSNBC Anchor",
    "text": "USUALLY PEOPLE LIKE MADURO \nIN VENEZUELA GOING OUT AND \nGIVING MONEY AROUND ELECTION TIME \nTO TRY AND GREASE THE NUMBER.",
    "isRecorded": true
  },
  {
    "time": "07:31",
    "seconds": 451,
    "speaker": "MSNBC Anchor",
    "text": "AND SHOES, TALKING ABOUT \nGOLF, BUT WHAT TRUMP COUNTS ON IS \nTHAT THERE'S INSTAGRAM ACCOUNTS, WEBSITES, THEY'RE TALKING \nTALKING ABOUT SPORTS,",
    "isRecorded": true
  },
  {
    "time": "07:38",
    "seconds": 458,
    "speaker": "MSNBC Anchor",
    "text": "TALKING ABOUT SHOES, \nTALKING ABOUT GOLF, TALKING ABOUT BEER AND \nBROOCHACHOS OR WHATEVER.",
    "isRecorded": true
  },
  {
    "time": "07:44",
    "seconds": 464,
    "speaker": "MSNBC Anchor",
    "text": "THEY HONE IN ON DONALD \nTRUMP IS GOING TO GIVE EVERYBODY $5 BIT OF $5 ,000 \nAND THAT SORT OF TAKES OFF AND GOES, CATCHES \nLIKE WILDFIRE",
    "isRecorded": true
  },
  {
    "time": "07:51",
    "seconds": 471,
    "speaker": "MSNBC Anchor",
    "text": "THROUGH THE INFORMATION \nECHO CHAMBER.",
    "isRecorded": true
  },
  {
    "time": "07:53",
    "seconds": 473,
    "speaker": "MSNBC Anchor",
    "text": "SO THIS IS DOA ON THIS IS \nTHE D .O .A.",
    "isRecorded": true
  },
  {
    "time": "07:57",
    "seconds": 477,
    "speaker": "MSNBC Anchor",
    "text": "AND THE TREASURY FOR THE \nINFLATIONARY REASONS THAT WERE MENTIONED EARLIER AND LAST BUT NOT \nLEAST, IT'S SCREAMS OF SOMEONE WHO \nIS",
    "isRecorded": true
  },
  {
    "time": "08:04",
    "seconds": 484,
    "speaker": "MSNBC Anchor",
    "text": "DESPERATE AND HOLDING ON TO PRESIDENT WHO HAS SUPPOSED \nDRAFTED THIS WHEN HE HAD 30 % APPROVAL \nRATINGS AROUND THE COUNTRY, SOME OF THE LOWEST \nIN history.",
    "isRecorded": true
  },
  {
    "time": "08:12",
    "seconds": 492,
    "speaker": "MSNBC Anchor",
    "text": "So it's not worth $4 ,999, \nI'll tell you that.",
    "isRecorded": true
  },
  {
    "time": "08:17",
    "seconds": 497,
    "speaker": "MSNBC Anchor",
    "text": "You know, Charles,\nI want to broaden this conversation out beyond the Hill,\nbeyond this one singular promise and to the broader economic",
    "isRecorded": true
  },
  {
    "time": "08:27",
    "seconds": 507,
    "speaker": "MSNBC Anchor",
    "text": "I WANT TO PLAY SOME OF THE \nHIGH POINTS OF THAT LAST NIGHT.",
    "isRecorded": true
  },
  {
    "time": "08:30",
    "seconds": 510,
    "speaker": "MSNBC Anchor",
    "text": "WATCH.",
    "isRecorded": true
  },
  {
    "time": "08:33",
    "seconds": 513,
    "speaker": "MSNBC Anchor",
    "text": "WE HAVE $100 A BARREL OIL \nRIGHT NOW OR THAT'S WHAT IT HIT WE HAVE BEEN TRYING TO GET \nGAS CHEAPER AND THAT'S MORE \nDIFFICULT",
    "isRecorded": true
  },
  {
    "time": "08:45",
    "seconds": 525,
    "speaker": "MSNBC Anchor",
    "text": "THAN WE THOUGHT.",
    "isRecorded": true
  },
  {
    "time": "08:46",
    "seconds": 526,
    "speaker": "MSNBC Anchor",
    "text": "ARE YOU WORRIED THAT THESE \nOIL PRICES WILL CONTINUE AS THE SECRETARY OF INTERIOR IS\nI KNOW YOU'RE IN YOUR PERSONAL CAPACITY, BUT THAT'S NOT A GOOD THING \nGOING",
    "isRecorded": true
  },
  {
    "time": "08:53",
    "seconds": 533,
    "speaker": "MSNBC Anchor",
    "text": "INTO AN ELECTION TO HAVE GAS AS SUSPENSIVE.",
    "isRecorded": true
  },
  {
    "time": "08:57",
    "seconds": 537,
    "speaker": "MSNBC Anchor",
    "text": "IT ISN'T,\nBUT IT'S A MUCH BETTER THING TO MAKE SURE WE DON'T\nhow they a terrorist group with a nuclear weapon.",
    "isRecorded": true
  },
  {
    "time": "09:04",
    "seconds": 544,
    "speaker": "MSNBC Anchor",
    "text": "In the Biden years,\nthe cost of food went up 25 percent and 25 percent in just two \nyears of Donald Trump.",
    "isRecorded": true
  },
  {
    "time": "09:11",
    "seconds": 551,
    "speaker": "MSNBC Anchor",
    "text": "We're holding that at a 20 \nyear average of about two and a half \npercent.",
    "isRecorded": true
  },
  {
    "time": "09:14",
    "seconds": 554,
    "speaker": "MSNBC Anchor",
    "text": "Why does the administration\nand why do Republicans and those around the president keep talking\nabout the Biden administration?",
    "isRecorded": true
  },
  {
    "time": "09:19",
    "seconds": 559,
    "speaker": "MSNBC Anchor",
    "text": "Like at this point it's \neight weeks out until the next midterm \nelections.",
    "isRecorded": true
  },
  {
    "time": "09:24",
    "seconds": 564,
    "speaker": "MSNBC Anchor",
    "text": "Do you really believe\nthat the American people at this point in time want \nto hear about President Biden and core inflation and all \nthat?",
    "isRecorded": true
  },
  {
    "time": "09:33",
    "seconds": 573,
    "speaker": "MSNBC Anchor",
    "text": "This is working just 19 \nmonths in reversing the very \ndamaging four years of the Biden administration.",
    "isRecorded": true
  },
  {
    "time": "09:38",
    "seconds": 578,
    "speaker": "MSNBC Anchor",
    "text": "And we have to explain to \nthe American people those were their \npolicies that we're trying to dig \nout of.",
    "isRecorded": true
  },
  {
    "time": "09:44",
    "seconds": 584,
    "speaker": "MSNBC Anchor",
    "text": "And we have more to do,\nbut we're doing great getting there.",
    "isRecorded": true
  },
  {
    "time": "09:48",
    "seconds": 588,
    "speaker": "MSNBC Anchor",
    "text": "Charles, I just think it \nlent to a message that if I'm being gracious \nfelt scattered, it's Biden.",
    "isRecorded": true
  },
  {
    "time": "09:54",
    "seconds": 594,
    "speaker": "MSNBC Anchor",
    "text": "No, it's Democrats.",
    "isRecorded": true
  },
  {
    "time": "09:55",
    "seconds": 595,
    "speaker": "MSNBC Anchor",
    "text": "No, it's an election that's \nactually all about Trump.",
    "isRecorded": true
  },
  {
    "time": "09:57",
    "seconds": 597,
    "speaker": "MSNBC Anchor",
    "text": "I mean, like what is the \nRepublican message if you're a voter who's \ntrying to figure out, like, what is this about?",
    "isRecorded": true
  },
  {
    "time": "10:02",
    "seconds": 602,
    "speaker": "MSNBC Anchor",
    "text": "The problem here is that \nyou simply cannot lie about the things \nthat people touch and feel every day.",
    "isRecorded": true
  },
  {
    "time": "10:08",
    "seconds": 608,
    "speaker": "MSNBC Anchor",
    "text": "You can't lie about the, \nyou know, how much it takes to fill a \ntank.",
    "isRecorded": true
  },
  {
    "time": "10:12",
    "seconds": 612,
    "speaker": "MSNBC Anchor",
    "text": "You can't lie about a dozen \neggs or how much it costs to \nfeed a family of four because people are dealing \nwith that every day.",
    "isRecorded": true
  },
  {
    "time": "10:18",
    "seconds": 618,
    "speaker": "MSNBC Anchor",
    "text": "They have to touch that \nevery day.",
    "isRecorded": true
  },
  {
    "time": "10:19",
    "seconds": 619,
    "speaker": "MSNBC Anchor",
    "text": "And so what they have \nchosen to do, what Donald Trump has told \nthem to do, is to lie about a promise.",
    "isRecorded": true
  },
  {
    "time": "10:24",
    "seconds": 624,
    "speaker": "MSNBC Anchor",
    "text": "And I think, you know, it \nis really, really important for us to \nsay over and over and over, not going to \nhappen, pipe dream, this is not a real thing \nbecause",
    "isRecorded": true
  },
  {
    "time": "10:33",
    "seconds": 633,
    "speaker": "MSNBC Anchor",
    "text": "Because as Luke pointed \nout, this idea that \nlow-information voters actually do kind of absorb the idea, \nthe hope of this.",
    "isRecorded": true
  },
  {
    "time": "10:44",
    "seconds": 644,
    "speaker": "MSNBC Anchor",
    "text": "And I think in the last \nelection cycle, I talked to a lot of people \nwho were not well-off.",
    "isRecorded": true
  },
  {
    "time": "10:51",
    "seconds": 651,
    "speaker": "MSNBC Anchor",
    "text": "And I don't think we talk\nabout how the impact on poor people enough, that first round of checks \nduring COVID, that Trump and Mnuchin \ninsisted",
    "isRecorded": true
  },
  {
    "time": "11:00",
    "seconds": 660,
    "speaker": "MSNBC Anchor",
    "text": "that his name be became \nTrump checks that was welded in people's \nmind and they felt that \nimmediately and it had a resonance that \nwas very real",
    "isRecorded": true
  },
  {
    "time": "11:07",
    "seconds": 667,
    "speaker": "MSNBC Anchor",
    "text": "for a lot of very poor \npeople.",
    "isRecorded": true
  },
  {
    "time": "11:09",
    "seconds": 669,
    "speaker": "MSNBC Anchor",
    "text": "They attributed that to \nhim, and I think that he \nunderstands that that it, particularly for \npoor people, poor voters, working class \npeople,",
    "isRecorded": true
  },
  {
    "time": "11:18",
    "seconds": 678,
    "speaker": "MSNBC Anchor",
    "text": "the idea of hope,\nthe idea of a possibility of a break is actually real \ncurrency.",
    "isRecorded": true
  },
  {
    "time": "11:25",
    "seconds": 685,
    "speaker": "MSNBC Anchor",
    "text": "And so we have a \nresponsibility to keep trying\nto knock that down.",
    "isRecorded": true
  },
  {
    "time": "11:30",
    "seconds": 690,
    "speaker": "MSNBC Anchor",
    "text": "Don't talk about it as if \nit's a real thing, because it absolutely is \nnot.",
    "isRecorded": true
  },
  {
    "time": "11:34",
    "seconds": 694,
    "speaker": "MSNBC Anchor",
    "text": "And people do not need to \nput hope in the false hope in the \nidea that someone is going to \ncome back and give $5 $5 ,000 checks \nto everyone.",
    "isRecorded": true
  },
  {
    "time": "11:41",
    "seconds": 701,
    "speaker": "MSNBC Anchor",
    "text": "I do think you're right to \npoint",
    "isRecorded": true
  }
],
  "lTHyTkjyCKE": [
  {
    "time": "00:01",
    "seconds": 1,
    "speaker": "MSNBC Anchor",
    "text": "credit to the people we're \ngoing to do this in a fiscally responsible way \nwe're not going to add to the deficit and in \nfact we're going",
    "isRecorded": true
  },
  {
    "time": "00:06",
    "seconds": 6,
    "speaker": "MSNBC Anchor",
    "text": "to bring the indebtedness \ndown you said that this should pay for it \nshould you're right and well you know the house \nversion did",
    "isRecorded": true
  },
  {
    "time": "00:13",
    "seconds": 13,
    "speaker": "MSNBC Anchor",
    "text": "those cuts aren't just \nsymbolic they're the first step in restoring \nfiscal discipline and changing the trajectory\nof our nation's debt crisis",
    "isRecorded": true
  },
  {
    "time": "00:21",
    "seconds": 21,
    "speaker": "MSNBC Anchor",
    "text": "the score said this is going to add \ntrillions over the next decade are \nyou are you really holding out hope that we \ncan grow the economy",
    "isRecorded": true
  },
  {
    "time": "00:29",
    "seconds": 29,
    "speaker": "MSNBC Anchor",
    "text": "so fast that it still pays \nfor itself well I mean yes we're gonna need \nto do that and I think we can when \nRepublican lawmakers sold us on their 2025 tax \ncuts they insisted",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "MSNBC Anchor",
    "text": "it was being done \nresponsibly that they would pay for \nthemselves instead spending continues to \noutpace tax revenue now the federal \ndeficit is growing",
    "isRecorded": true
  },
  {
    "time": "00:47",
    "seconds": 47,
    "speaker": "MSNBC Anchor",
    "text": "by two trillion per year so \nwhat happened Catherine Rampell and Betsy \nStevenson are back with us Catherine I think \nit's really stunning",
    "isRecorded": true
  },
  {
    "time": "00:55",
    "seconds": 55,
    "speaker": "MSNBC Anchor",
    "text": "to see the excuses that are \nnow being made THAT HAVE BEEN MADE, \nESPECIALLY WITH THE REASONS WE WERE \nGIVEN AT THE TIME OF, OH, THIS TAX BILL WILL PAY \nFOR ITSELF.",
    "isRecorded": true
  },
  {
    "time": "01:03",
    "seconds": 63,
    "speaker": "MSNBC Anchor",
    "text": "I'M STILL STRUCK BY THE \nFACT WHEN THEY ACTUALLY SCORED \nTHIS BILL, THEY BASICALLY ZEROED OUT \nTHE PERMANENT TAX CUT EXTENSION \nUSING",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "MSNBC Anchor",
    "text": "SOME TRICKY SENATE MATH.",
    "isRecorded": true
  },
  {
    "time": "01:11",
    "seconds": 71,
    "speaker": "MSNBC Anchor",
    "text": "AND SO WHAT DOES IT SAY \nTHAT THEY'RE NOW HAVING TO MAKE \nTHESE EXCUSES, ESPECIALLY GIVEN THE \nREASONING THAT THEY THOUGHT COME APRIL THAT TAX CUTS WOULD \nYIELD",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "MSNBC Anchor",
    "text": "HIGHER TAX REBATES AND \nTHAT'S EXACTLY when the iran war \ngas prices were starting to hit and people were complaining\nabout tariffs well they",
    "isRecorded": true
  },
  {
    "time": "01:25",
    "seconds": 85,
    "speaker": "MSNBC Anchor",
    "text": "always knew that these tax cuts were \nnot going to pay for themselves they make \nthis claim every time they put tax \ncuts on the floor of the house",
    "isRecorded": true
  },
  {
    "time": "01:34",
    "seconds": 94,
    "speaker": "MSNBC Anchor",
    "text": "or the senate and every \ntime they know it's fake and \nusually the senate parliamentarian \nwill kind of call them on their bs \nthis time",
    "isRecorded": true
  },
  {
    "time": "01:44",
    "seconds": 104,
    "speaker": "MSNBC Anchor",
    "text": "around they basically \ninvented their own funny math and everybody went on \ntheir merry way.",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "MSNBC Anchor",
    "text": "The idea that the tax \nrebates that were in the offing might pay \noff, bribe, whatever voters may have \nappealed at one point,",
    "isRecorded": true
  },
  {
    "time": "02:00",
    "seconds": 120,
    "speaker": "MSNBC Anchor",
    "text": "regardless of the cost of \nall of this.",
    "isRecorded": true
  },
  {
    "time": "02:04",
    "seconds": 124,
    "speaker": "MSNBC Anchor",
    "text": "The problem, as you point \nout, is that all of the rest of Donald Trump's agenda \nmore than offsets whatever \nbenefit people may have felt from those \nslightly bigger",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "MSNBC Anchor",
    "text": "refunds earlier this year, thanks to the tariffs, \nwhich are, again, taxes, as well as the war, as well as a host of other \nthings",
    "isRecorded": true
  },
  {
    "time": "02:23",
    "seconds": 143,
    "speaker": "MSNBC Anchor",
    "text": "that this administration is \ndoing, including, I would argue,\ntrying to politicize the Federal Reserve, which is also bad for \ninflation",
    "isRecorded": true
  },
  {
    "time": "02:30",
    "seconds": 150,
    "speaker": "MSNBC Anchor",
    "text": "and for affordability.",
    "isRecorded": true
  },
  {
    "time": "02:32",
    "seconds": 152,
    "speaker": "MSNBC Anchor",
    "text": "But they never really think \nahead.",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "MSNBC Anchor",
    "text": "This is an administration.",
    "isRecorded": true
  },
  {
    "time": "02:36",
    "seconds": 156,
    "speaker": "MSNBC Anchor",
    "text": "This is a Republican \nCongress aligned with this administration \nthat is really just trying to get \nthrough tomorrow.",
    "isRecorded": true
  },
  {
    "time": "02:42",
    "seconds": 162,
    "speaker": "MSNBC Anchor",
    "text": "They're just trying to get \nthrough the midterms, as we've heard when we \ntalked about the promised rebates \nor dividends or whatever you want to \ncall.",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "MSNBC Anchor",
    "text": "Again, yet another Trump \nbribe.",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "MSNBC Anchor",
    "text": "They're not thinking about \nwhat this means for the federal debt or the \ndeficit, what it means for the bond \nmarket, or what it means for \nAmerica's long-term",
    "isRecorded": true
  },
  {
    "time": "02:58",
    "seconds": 178,
    "speaker": "MSNBC Anchor",
    "text": "credibility as a stable \neconomy.",
    "isRecorded": true
  },
  {
    "time": "03:01",
    "seconds": 181,
    "speaker": "MSNBC Anchor",
    "text": "But I'm sure, Betsy, that \nyou are.",
    "isRecorded": true
  },
  {
    "time": "03:03",
    "seconds": 183,
    "speaker": "MSNBC Anchor",
    "text": "So how are you thinking\nabout those THESE THINGS?",
    "isRecorded": true
  },
  {
    "time": "03:07",
    "seconds": 187,
    "speaker": "MSNBC Anchor",
    "text": "WELL, YOU KNOW,\nI THINK WHAT THEY WANT TO CLAIM WITH THESE KINDS OF TAX CUTS IS THEY \nARE GOING TO SOMEHOW GROW THE ECONOMY.",
    "isRecorded": true
  },
  {
    "time": "03:16",
    "seconds": 196,
    "speaker": "MSNBC Anchor",
    "text": "AND IF YOU LOOK AT MODELS \nFROM REALLY EVEN CONSERVATIVE \nORGANIZATIONS LIKE THE TAX FOUNDATION, YOU SEE A SMALL INCREASE IN",
    "isRecorded": true
  },
  {
    "time": "03:30",
    "seconds": 210,
    "speaker": "MSNBC Anchor",
    "text": "THEY SHOW A MASSIVE \nDECREASE IN TAX REVENUE AND THEREFORE \nTRILLIONS OF DOLLARS ADDED TO THE DEBT.",
    "isRecorded": true
  },
  {
    "time": "03:38",
    "seconds": 218,
    "speaker": "MSNBC Anchor",
    "text": "LITTLE BIT,\nBUT THOSE TRILLIONS OF DOLLARS DRIVING UP THE INTEREST \nRATES THAT ORDINARY AMERICANS PAY.",
    "isRecorded": true
  },
  {
    "time": "03:44",
    "seconds": 224,
    "speaker": "MSNBC Anchor",
    "text": "AND THEREFORE EVEN IF GDP THEY SHOW THAT THE INCOMES \nFOR AMERICAN HOUSEHOLDS ONCE WE",
    "isRecorded": true
  },
  {
    "time": "03:54",
    "seconds": 234,
    "speaker": "MSNBC Anchor",
    "text": "ADJUST FOR THOSE COST \nINCREASES ARE ACTUALLY GOING DOWN.",
    "isRecorded": true
  },
  {
    "time": "03:57",
    "seconds": 237,
    "speaker": "MSNBC Anchor",
    "text": "AND THIS GETS REALLY WONKY IT'S WHY THEY SHOW, YOU \nKNOW, GROSS NATIONAL PRODUCT \nMEANING WHAT AMERICANS OWN VERSUS WHAT'S PRODUCED \nON OUR SOIL AND GDP.",
    "isRecorded": true
  },
  {
    "time": "04:07",
    "seconds": 247,
    "speaker": "MSNBC Anchor",
    "text": "THERE'S A BIG WEDGE BETWEEN \nTHE TWO WHEN THEY DON'T ACTUALLY REALLY MANAGE TO INCREASE \nTHE FIRST ONE, GROSS NATIONAL PRODUCT.",
    "isRecorded": true
  },
  {
    "time": "04:14",
    "seconds": 254,
    "speaker": "MSNBC Anchor",
    "text": "AGAIN, IT'S A SUPER WONKY \nWAY TO THINK ABOUT IT.",
    "isRecorded": true
  },
  {
    "time": "04:17",
    "seconds": 257,
    "speaker": "MSNBC Anchor",
    "text": "I THINK THE REALLY EASY WAY \nTO TAKE THIS AWAY IS THIS HAS \nALWAYS BEEN A SET OF POLICIES\nTHE BORDER IS DESIGNED TO HELP THE VERY RICHEST PEOPLE WHO \nMAY",
    "isRecorded": true
  },
  {
    "time": "04:28",
    "seconds": 268,
    "speaker": "MSNBC Anchor",
    "text": "NOT EVEN BE AMERICANS WHICH \nIS SUPER IRONIC GIVEN ALL THE \nSTUFF ABOUT TARIFFS BUT WE'RE WE'RE GREAT WITH THE \nFOREIGNERS WHO OWN ASSETS IN AMERICA.",
    "isRecorded": true
  },
  {
    "time": "04:37",
    "seconds": 277,
    "speaker": "MSNBC Anchor",
    "text": "WHY WOULD WE WANT TO TAX \nTHEM?",
    "isRecorded": true
  },
  {
    "time": "04:39",
    "seconds": 279,
    "speaker": "MSNBC Anchor",
    "text": "LET THEM KEEP COMING HERE \nMAKING TONS OF MONEY AND WHAT \nWE'LL DO IS WE'LL TAKE IT OFF THE \nBACKS OF AMERICAN WORKERS.",
    "isRecorded": true
  },
  {
    "time": "04:45",
    "seconds": 285,
    "speaker": "MSNBC Anchor",
    "text": "I JUST WANT TO ADD I DON'T \nTHINK IT'S SO IMPORTANT.",
    "isRecorded": true
  },
  {
    "time": "04:48",
    "seconds": 288,
    "speaker": "MSNBC Anchor",
    "text": "ONE LESS THING BECAUSE IT'S \nSO IMPORTANT IS THAT WE ARE TRYING TO \nCOLLECT REVENUE FROM WORKERS ON A SMALLER AND \nSMALLER BASIS.",
    "isRecorded": true
  },
  {
    "time": "04:55",
    "seconds": 295,
    "speaker": "MSNBC Anchor",
    "text": "THE LABOR SHARE OF INCOME\nTHE AMERICAN AMERICAN HAS FALLEN FROM AROUND TWO-THIRDS OF \nGDP GOING TO OUR WORKERS TO NOW",
    "isRecorded": true
  },
  {
    "time": "05:05",
    "seconds": 305,
    "speaker": "MSNBC Anchor",
    "text": "THE REST OF IT IS GOING TO \nINVESTORS, AGAIN NOT ALL OF WHOM ARE \nAMERICAN AND THIS IS WHO THEY'RE BENEFITING WITH \nTHEIR POLICIES.",
    "isRecorded": true
  },
  {
    "time": "05:13",
    "seconds": 313,
    "speaker": "MSNBC Anchor",
    "text": "AND OF COURSE THE CBO AND I THINK IT WOULD \nBENEFIT THE WEALTHY AMERICANS AND \nOTHERS WHEN IT CAME TO WHO WAS \nIMPACTED.",
    "isRecorded": true
  },
  {
    "time": "05:24",
    "seconds": 324,
    "speaker": "MSNBC Anchor",
    "text": "AND I THINK, KATHRYN,\nIF WE ZOOM OUT EVEN FURTHER, I I think to viewers of \nthis, they might say, well, wait, Republicans used to say\nthat they cared about the",
    "isRecorded": true
  },
  {
    "time": "05:31",
    "seconds": 331,
    "speaker": "MSNBC Anchor",
    "text": "national debt.",
    "isRecorded": true
  },
  {
    "time": "05:32",
    "seconds": 332,
    "speaker": "MSNBC Anchor",
    "text": "And for years,\nthe Republican Party has touted itself as the party of belt \ntightening and fiscal discipline along \nwith tax cuts.",
    "isRecorded": true
  },
  {
    "time": "05:39",
    "seconds": 339,
    "speaker": "MSNBC Anchor",
    "text": "And now it's just.",
    "isRecorded": true
  },
  {
    "time": "05:44",
    "seconds": 344,
    "speaker": "MSNBC Anchor",
    "text": "I THINK THERE'S A LOT OF\nCONSERVATIVE IDEOLOGY THAT HAS BEEN FLIPPED COMPLETELY\nUPSIDE DOWN BECAUSE TRUMP WAS NEVER A CONSERVATIVE \nIDEOLOGUE.",
    "isRecorded": true
  },
  {
    "time": "05:51",
    "seconds": 351,
    "speaker": "MSNBC Anchor",
    "text": "I HEAR THIS from Republicans who are\nlike actual fiscal Republicans still.",
    "isRecorded": true
  },
  {
    "time": "05:55",
    "seconds": 355,
    "speaker": "MSNBC Anchor",
    "text": "And yet, this is where the \nparty is.",
    "isRecorded": true
  },
  {
    "time": "05:58",
    "seconds": 358,
    "speaker": "MSNBC Anchor",
    "text": "So what is the risk of \nthat, especially as the national \ndebt continues to balloon?",
    "isRecorded": true
  },
  {
    "time": "06:02",
    "seconds": 362,
    "speaker": "MSNBC Anchor",
    "text": "I think this actually \npredates Trump.",
    "isRecorded": true
  },
  {
    "time": "06:04",
    "seconds": 364,
    "speaker": "MSNBC Anchor",
    "text": "Trump has definitely \nsupercharged the republican party's \ninterest in cutting taxes and \nincreasing spending he's signed into law \ntrillions of dollars",
    "isRecorded": true
  },
  {
    "time": "06:14",
    "seconds": 374,
    "speaker": "MSNBC Anchor",
    "text": "of additional spending both \nat this term and in his prior term but \nit predates him.",
    "isRecorded": true
  },
  {
    "time": "06:19",
    "seconds": 379,
    "speaker": "MSNBC Anchor",
    "text": "Are you familiar with \ncicadas?",
    "isRecorded": true
  },
  {
    "time": "06:20",
    "seconds": 380,
    "speaker": "MSNBC Anchor",
    "text": "Do you know what cicadas \nare?",
    "isRecorded": true
  },
  {
    "time": "06:22",
    "seconds": 382,
    "speaker": "MSNBC Anchor",
    "text": "They go underground for \nlike 17 years or whatever and then they \nreemerge enjoying the world.",
    "isRecorded": true
  },
  {
    "time": "06:29",
    "seconds": 389,
    "speaker": "MSNBC Anchor",
    "text": "I feel like to some extent \nthe Republican",
    "isRecorded": true
  },
  {
    "time": "06:48",
    "seconds": 408,
    "speaker": "MSNBC Anchor",
    "text": "people are saying,\nhey we should care about deficits.",
    "isRecorded": true
  },
  {
    "time": "06:50",
    "seconds": 410,
    "speaker": "MSNBC Anchor",
    "text": "We should care about debts.",
    "isRecorded": true
  },
  {
    "time": "06:52",
    "seconds": 412,
    "speaker": "MSNBC Anchor",
    "text": "These are things that \nreally matter and then they win an \nelection and they get their guy in \nthe White House again, and then they burrow back \nunderground.",
    "isRecorded": true
  },
  {
    "time": "07:01",
    "seconds": 421,
    "speaker": "MSNBC Anchor",
    "text": "And that's sort of how the \nparty has worked, not just in the Trump era, but for decades at this \npoint.",
    "isRecorded": true
  },
  {
    "time": "07:07",
    "seconds": 427,
    "speaker": "MSNBC Anchor",
    "text": "You know, George W. Bush \nalso signed into law.",
    "isRecorded": true
  },
  {
    "time": "07:10",
    "seconds": 430,
    "speaker": "MSNBC Anchor",
    "text": "Huge, huge increases to \ndeficits, mostly through the tax cut \nside, but also through additional \nspending starting a couple of wars.",
    "isRecorded": true
  },
  {
    "time": "07:18",
    "seconds": 438,
    "speaker": "MSNBC Anchor",
    "text": "So this is not entirely new.",
    "isRecorded": true
  },
  {
    "time": "07:21",
    "seconds": 441,
    "speaker": "MSNBC Anchor",
    "text": "It's just, again,\nhow credulously people in the press have treated \nsome of these professed concerns about fiscal responsibility.",
    "isRecorded": true
  },
  {
    "time": "07:30",
    "seconds": 450,
    "speaker": "MSNBC Anchor",
    "text": "Republicans never really \ncared.",
    "isRecorded": true
  },
  {
    "time": "07:32",
    "seconds": 452,
    "speaker": "MSNBC Anchor",
    "text": "They just pretend to when \nit's CONVENIENT WHEN THEY WANT TO STYMIE A \nDEMOCRATIC AGENDA.",
    "isRecorded": true
  },
  {
    "time": "07:37",
    "seconds": 457,
    "speaker": "MSNBC Anchor",
    "text": "AND WHEN THEY'RE IN THE \nMINORITY ON CAPITOL HILL.",
    "isRecorded": true
  },
  {
    "time": "07:40",
    "seconds": 460,
    "speaker": "MSNBC Anchor",
    "text": "CATHERINE RAMPELL,\nYOU HAVE FOREVER CHANGED THE WAY THAT I'M GOING TO THINK \nABOUT CICADAS.",
    "isRecorded": true
  },
  {
    "time": "07:43",
    "seconds": 463,
    "speaker": "MSNBC Anchor",
    "text": "AND BEDTHY STEVENSON,\nTHANK YOU BOTH FOR COMING ON AND TALKING THIS THROUGH WITH \ndoes.",
    "isRecorded": true
  },
  {
    "time": "07:47",
    "seconds": 467,
    "speaker": "MSNBC Anchor",
    "text": "plan",
    "isRecorded": true
  }
],
  "HLskpaFjApg": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "People Host",
    "text": "I feel like this is going to be a great interview.",
    "isRecorded": true
  },
  {
    "time": "00:02",
    "seconds": 2,
    "speaker": "People Host",
    "text": ">> The love is blind vibes. I love it. Only one of you will be named people's next red carpet reporter and will be joining me at the Emmys this year.",
    "isRecorded": true
  },
  {
    "time": "00:11",
    "seconds": 11,
    "speaker": "People Host",
    "text": ">> Here to share a few words is the president of the beauty style and entertainment group at People Inc. Leah Wire, >> Lizzy, Carly, Alex. Today you will be",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "People Host",
    "text": "challenged with using your reporter skills during a blind interview. You have to use your instincts to make a connection with them and get them to",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "People Host",
    "text": "open up to you. And we will all be listening. The love is blind vibes. I'm a big watcher of the show.",
    "isRecorded": true
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "People Host",
    "text": ">> Can you hear me over there? Oz the great and powerful.",
    "isRecorded": true
  },
  {
    "time": "00:37",
    "seconds": 37,
    "speaker": "People Host",
    "text": ">> Oz hears you.",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "People Host",
    "text": ">> Can we give it like a a nice little like British accent? It's so cool to be talking to you like this.",
    "isRecorded": true
  },
  {
    "time": "00:43",
    "seconds": 43,
    "speaker": "People Host",
    "text": ">> I feel like this is going to be a great interview.",
    "isRecorded": true
  },
  {
    "time": "00:46",
    "seconds": 46,
    "speaker": "People Host",
    "text": ">> How did your experience growing up lead to where you are today?",
    "isRecorded": true
  },
  {
    "time": "00:49",
    "seconds": 49,
    "speaker": "People Host",
    "text": ">> I have no idea how I ended up here. What achievement of yours means the most to you?",
    "isRecorded": true
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "People Host",
    "text": ">> And I'm still standing.",
    "isRecorded": true
  },
  {
    "time": "00:55",
    "seconds": 55,
    "speaker": "People Host",
    "text": ">> When you are at your happiest, what do you find yourself doing?",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "People Host",
    "text": ">> Sometimes staring at a blank wall.",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "People Host",
    "text": ">> Sounds like me, huh?",
    "isRecorded": true
  },
  {
    "time": "01:03",
    "seconds": 63,
    "speaker": "People Host",
    "text": ">> What would you say a typical day in the life looks like for you?",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "People Host",
    "text": ">> I'll get up, have a giant, >> cup of coffee, go work out, and then I'll be on set with you.",
    "isRecorded": true
  },
  {
    "time": "01:13",
    "seconds": 73,
    "speaker": "People Host",
    "text": ">> What is your relationship status?",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "People Host",
    "text": ">> I'm married.",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "People Host",
    "text": ">> How long have you been married?",
    "isRecorded": true
  },
  {
    "time": "01:17",
    "seconds": 77,
    "speaker": "People Host",
    "text": ">> 14 years.",
    "isRecorded": true
  },
  {
    "time": "01:18",
    "seconds": 78,
    "speaker": "People Host",
    "text": ">> Do you have children?",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "People Host",
    "text": ">> Yes.",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "People Host",
    "text": ">> How many? More than one.",
    "isRecorded": true
  },
  {
    "time": "01:21",
    "seconds": 81,
    "speaker": "People Host",
    "text": ">> Have you ever done reality TV?",
    "isRecorded": true
  },
  {
    "time": "01:23",
    "seconds": 83,
    "speaker": "People Host",
    "text": ">> Yes.",
    "isRecorded": true
  },
  {
    "time": "01:24",
    "seconds": 84,
    "speaker": "People Host",
    "text": ">> Was it a dating show or like a competition show?",
    "isRecorded": true
  },
  {
    "time": "01:27",
    "seconds": 87,
    "speaker": "People Host",
    "text": ">> Many different shows.",
    "isRecorded": true
  },
  {
    "time": "01:28",
    "seconds": 88,
    "speaker": "People Host",
    "text": ">> I have a hunch here. Have you done Dancing with the Stars?",
    "isRecorded": true
  },
  {
    "time": "01:35",
    "seconds": 95,
    "speaker": "People Host",
    "text": ">> I have.",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "People Host",
    "text": ">> Now you can say you sort of had a blind date with Elia Botw.",
    "isRecorded": true
  },
  {
    "time": "01:47",
    "seconds": 107,
    "speaker": "People Host",
    "text": ">> That was so fun.",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "People Host",
    "text": ">> Let's start with Alex. How do you think she did as a red carpet interviewer?",
    "isRecorded": true
  },
  {
    "time": "01:52",
    "seconds": 112,
    "speaker": "People Host",
    "text": ">> I think that she'd be great for a long form interview. She was able to go pretty deep.",
    "isRecorded": true
  },
  {
    "time": "01:56",
    "seconds": 116,
    "speaker": "People Host",
    "text": ">> What is the most rewarding part about being a mom for you?",
    "isRecorded": true
  },
  {
    "time": "02:00",
    "seconds": 120,
    "speaker": "People Host",
    "text": ">> Carly was a sleuth, yet she had moments where she showed her own humanity. I like a lot of old game shows.",
    "isRecorded": true
  },
  {
    "time": "02:08",
    "seconds": 128,
    "speaker": "People Host",
    "text": ">> It reminds me of staying home calling out sick from school.",
    "isRecorded": true
  },
  {
    "time": "02:11",
    "seconds": 131,
    "speaker": "People Host",
    "text": ">> So, you're like Ferris Beer.",
    "isRecorded": true
  },
  {
    "time": "02:12",
    "seconds": 132,
    "speaker": "People Host",
    "text": ">> Totally.",
    "isRecorded": true
  },
  {
    "time": "02:13",
    "seconds": 133,
    "speaker": "People Host",
    "text": ">> And Lucy, I would just want to put her in like the press room at the White House. She's just like, she's going to rule the world.",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "People Host",
    "text": ">> What's your most unpopular opinion? For example, my hot take is I believe everyone's favorite color is actually blue. And if they say a different color,",
    "isRecorded": true
  },
  {
    "time": "02:26",
    "seconds": 146,
    "speaker": "People Host",
    "text": "they're just trying to be different.",
    "isRecorded": true
  },
  {
    "time": "02:27",
    "seconds": 147,
    "speaker": "People Host",
    "text": ">> But it might feel a little intense.",
    "isRecorded": true
  },
  {
    "time": "02:30",
    "seconds": 150,
    "speaker": "People Host",
    "text": ">> Absolutely.",
    "isRecorded": true
  },
  {
    "time": "02:30",
    "seconds": 150,
    "speaker": "People Host",
    "text": ">> This is it. Our final deliberation.",
    "isRecorded": true
  },
  {
    "time": "02:35",
    "seconds": 155,
    "speaker": "People Host",
    "text": ">> I have enough drama in my life anyway.",
    "isRecorded": true
  },
  {
    "time": "02:37",
    "seconds": 157,
    "speaker": "People Host",
    "text": "So, best of luck to all of you guys.",
    "isRecorded": true
  },
  {
    "time": "02:39",
    "seconds": 159,
    "speaker": "People Host",
    "text": "Goodbye.",
    "isRecorded": true
  },
  {
    "time": "02:40",
    "seconds": 160,
    "speaker": "People Host",
    "text": ">> The winner of People's Next Red Carpet reporter is",
    "isRecorded": true
  }
],
  "rbE3Th3RMmw": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "People Host",
    "text": "How did those interviews go? There was not one second of that that I was having a good time.",
    "isRecorded": true
  },
  {
    "time": "00:04",
    "seconds": 4,
    "speaker": "People Host",
    "text": ">> Should we circle back to the breakup stuff?",
    "isRecorded": true
  },
  {
    "time": "00:06",
    "seconds": 6,
    "speaker": "People Host",
    "text": ">> No. Well, no, no. He told me.",
    "isRecorded": true
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "People Host",
    "text": ">> Well, that was the point, right? It was supposed to be difficult. Honestly, props to them.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "People Host",
    "text": ">> I'm hating it.",
    "isRecorded": true
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "People Host",
    "text": ">> It was actually so [laughter] evil.",
    "isRecorded": true
  },
  {
    "time": "00:19",
    "seconds": 19,
    "speaker": "People Host",
    "text": ">> It's nice to know that they weren't actually high during my interview. I wish I not taking that edible, but I still wish I was.",
    "isRecorded": true
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "People Host",
    "text": ">> Let's start with the good [music] news.",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "People Host",
    "text": "The winner, who will be moving on to the next challenge, Lizzie.",
    "isRecorded": true
  },
  {
    "time": "00:33",
    "seconds": 33,
    "speaker": "People Host",
    "text": ">> [music] >> You are the first finalist.",
    "isRecorded": true
  },
  {
    "time": "00:37",
    "seconds": 37,
    "speaker": "People Host",
    "text": ">> It's like a breakup.",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "People Host",
    "text": ">> Oh, how have you been doing? You're doing >> I'm good.",
    "isRecorded": true
  },
  {
    "time": "00:40",
    "seconds": 40,
    "speaker": "People Host",
    "text": ">> Did he at least give a good reason?",
    "isRecorded": true
  },
  {
    "time": "00:41",
    "seconds": 41,
    "speaker": "People Host",
    "text": ">> Three years down the drain, right?",
    "isRecorded": true
  },
  {
    "time": "00:43",
    "seconds": 43,
    "speaker": "People Host",
    "text": ">> Three years?",
    "isRecorded": true
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "People Host",
    "text": ">> And like we were talking about like moving in with each other.",
    "isRecorded": true
  },
  {
    "time": "00:47",
    "seconds": 47,
    "speaker": "People Host",
    "text": ">> I'm recently went through a breakup, too, so I can very much relate.",
    "isRecorded": true
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "People Host",
    "text": ">> You did exactly what you were supposed to do.",
    "isRecorded": true
  },
  {
    "time": "00:52",
    "seconds": 52,
    "speaker": "People Host",
    "text": ">> That's crazy, making it to the top three. [music] I feel really good about myself.",
    "isRecorded": true
  },
  {
    "time": "00:56",
    "seconds": 56,
    "speaker": "People Host",
    "text": ">> Now it's time for the hard part. One of you has to say goodbye today.",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "People Host",
    "text": ">> I would like to play my immunity microphone.",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "People Host",
    "text": ">> Yesterday, we see a stack of magazines on the table.",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "People Host",
    "text": ">> This is an immunity idol.",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "People Host",
    "text": ">> Get a celeb to say they're saving you.",
    "isRecorded": true
  },
  {
    "time": "01:11",
    "seconds": 71,
    "speaker": "People Host",
    "text": "[music] >> It came with a task in order to use it.",
    "isRecorded": true
  },
  {
    "time": "01:14",
    "seconds": 74,
    "speaker": "People Host",
    "text": ">> Jack, being genuinely the coolest person I know, just said, \"Oh, I'll just text Aly and AJ in our group chat really quick.\" >> She sent me a really great video.",
    "isRecorded": true
  },
  {
    "time": "01:21",
    "seconds": 81,
    "speaker": "People Host",
    "text": ">> Since [music] our friend Jack was criminally eliminated, we are now endorsing Carly. [music] >> That works. You are safe, but one of you",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "People Host",
    "text": "is not.",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "People Host",
    "text": ">> My interview went terrible. It's just a matter of [music] how poorly each of us did. [laughter] >> I think that the overall content [music]",
    "isRecorded": true
  },
  {
    "time": "01:38",
    "seconds": 98,
    "speaker": "People Host",
    "text": "and confidence was deflated.",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "People Host",
    "text": ">> Brendan, I'm so sorry you missed the [music] mark. Your red carpet ends here.",
    "isRecorded": true
  },
  {
    "time": "01:45",
    "seconds": 105,
    "speaker": "People Host",
    "text": ">> I'm sorry.",
    "isRecorded": true
  },
  {
    "time": "01:47",
    "seconds": 107,
    "speaker": "People Host",
    "text": ">> [applause and cheering] >> I think I learned that I just have to trust [music] my gut, and I should just get out of my head during interviews.",
    "isRecorded": true
  },
  {
    "time": "01:55",
    "seconds": 115,
    "speaker": "People Host",
    "text": ">> Cheers.",
    "isRecorded": true
  },
  {
    "time": "01:56",
    "seconds": 116,
    "speaker": "People Host",
    "text": ">> We made it.",
    "isRecorded": true
  },
  {
    "time": "01:59",
    "seconds": 119,
    "speaker": "People Host",
    "text": ">> I thought I was packing. [music] I thought that was my swan song.",
    "isRecorded": true
  },
  {
    "time": "02:01",
    "seconds": 121,
    "speaker": "People Host",
    "text": ">> Oh my god, I can't believe I'm at the end. That means I have a one in three chance of actually [music] hosting the Emmys red carpet, and I genuinely can't",
    "isRecorded": true
  },
  {
    "time": "02:08",
    "seconds": 128,
    "speaker": "People Host",
    "text": "believe it.",
    "isRecorded": true
  },
  {
    "time": "02:09",
    "seconds": 129,
    "speaker": "People Host",
    "text": ">> We're all such close friends. [music] >> I'm struggling with this because I want you to win. I want you to win. You call me on the way to every [music] first",
    "isRecorded": true
  },
  {
    "time": "02:16",
    "seconds": 136,
    "speaker": "People Host",
    "text": "date.",
    "isRecorded": true
  },
  {
    "time": "02:16",
    "seconds": 136,
    "speaker": "People Host",
    "text": ">> That's true. I didn't even think I knew that.",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "People Host",
    "text": ">> Because I get anxious, and [music] Carly just calms me down and distracts me as I walk to first dates. Yeah.",
    "isRecorded": true
  },
  {
    "time": "02:24",
    "seconds": 144,
    "speaker": "People Host",
    "text": ">> Anytime Carly and I leave a red carpet or an event that's like [music] particularly meaningful, we'll text each other on the way home. Often you're in a",
    "isRecorded": true
  },
  {
    "time": "02:31",
    "seconds": 151,
    "speaker": "People Host",
    "text": "taxi, and it's just [music] tearing up in a taxi. Like, \"Oh my gosh, I'm here.",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "People Host",
    "text": "I'm living the dream\" kind of moment.",
    "isRecorded": true
  },
  {
    "time": "02:35",
    "seconds": 155,
    "speaker": "People Host",
    "text": ">> Carly's literally tearing >> [laughter] >> Like, all you have to do is say that, and I'm like, I know exactly how her night went. Act like I miss Brendan",
    "isRecorded": true
  },
  {
    "time": "02:42",
    "seconds": 162,
    "speaker": "People Host",
    "text": "already. [music] >> Yeah, I'm missing him.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "People Host",
    "text": ">> Why are you guys talking about me LIKE I'M DEAD? [laughter] >> THE LOVE IS BLIND VIBES.",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "People Host",
    "text": ">> CAN YOU HEAR ME OVER THERE, Oz the Great and Powerful? [music] >> Oz hears you.",
    "isRecorded": true
  }
],
  "kcMUbpMslpU": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "People Host",
    "text": "You're the Twink. Do you want her to ask you about sucking >> Huh. Welcome our guest judge for the day, Keltie [music] Knight.",
    "isRecorded": true
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "People Host",
    "text": ">> When you think of red carpet reporting, you think of Keltie Knight.",
    "isRecorded": true
  },
  {
    "time": "00:11",
    "seconds": 11,
    "speaker": "People Host",
    "text": ">> For your challenge, [music] you will be interviewing comedy stars Grant and Ash, aka a Twink [music] and a Redhead.",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "People Host",
    "text": ">> They're fun. They're big personalities.",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "People Host",
    "text": "I'm sure like they're nice people, so like they can't be that difficult of an interview, right?",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "People Host",
    "text": ">> What the contestants don't know is that we'll actually be judging them on how they keep their composure when an interview goes off the rails.",
    "isRecorded": true
  },
  {
    "time": "00:32",
    "seconds": 32,
    "speaker": "People Host",
    "text": ">> [laughter] >> What were you guys watching growing up that influenced who you are today?",
    "isRecorded": true
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "People Host",
    "text": ">> Cosby Show.",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "People Host",
    "text": ">> Whenever I encounter an awkward situation, I just smile uncontrollably.",
    "isRecorded": true
  },
  {
    "time": "00:43",
    "seconds": 43,
    "speaker": "People Host",
    "text": ">> Do you know the Cosby Show?",
    "isRecorded": true
  },
  {
    "time": "00:45",
    "seconds": 45,
    "speaker": "People Host",
    "text": ">> Familiar with it?",
    "isRecorded": true
  },
  {
    "time": "00:46",
    "seconds": 46,
    "speaker": "People Host",
    "text": ">> What are you supposed to say to that?",
    "isRecorded": true
  },
  {
    "time": "00:47",
    "seconds": 47,
    "speaker": "People Host",
    "text": ">> My strategy is walking in with the selfie in hand to show them to be like, \"Remember me, your old friend?\" >> Oh my god.",
    "isRecorded": true
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "People Host",
    "text": ">> Smart.",
    "isRecorded": true
  },
  {
    "time": "00:55",
    "seconds": 55,
    "speaker": "People Host",
    "text": ">> What's up, guys?",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "People Host",
    "text": ">> Interviewing Grant and Ash seems like a walk in the park.",
    "isRecorded": true
  },
  {
    "time": "01:00",
    "seconds": 60,
    "speaker": "People Host",
    "text": ">> Michael, do you have our Uncrustables?",
    "isRecorded": true
  },
  {
    "time": "01:02",
    "seconds": 62,
    "speaker": "People Host",
    "text": "We have not eaten all day.",
    "isRecorded": true
  },
  {
    "time": "01:03",
    "seconds": 63,
    "speaker": "People Host",
    "text": ">> I've actually interviewed them on a carpet before, so I was really excited.",
    "isRecorded": true
  },
  {
    "time": "01:06",
    "seconds": 66,
    "speaker": "People Host",
    "text": ">> What do you guys remember about your first impressions from each other?",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "People Host",
    "text": ">> Uh >> She looked pretty fussy.",
    "isRecorded": true
  },
  {
    "time": "01:11",
    "seconds": 71,
    "speaker": "People Host",
    "text": ">> Yeah.",
    "isRecorded": true
  },
  {
    "time": "01:12",
    "seconds": 72,
    "speaker": "People Host",
    "text": ">> It was a show.",
    "isRecorded": true
  },
  {
    "time": "01:14",
    "seconds": 74,
    "speaker": "People Host",
    "text": ">> You're getting engaged. How is wedding planning going?",
    "isRecorded": true
  },
  {
    "time": "01:17",
    "seconds": 77,
    "speaker": "People Host",
    "text": ">> It's it's a bit. You know it's a bit.",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "People Host",
    "text": ">> And you know it's a bit, but it's a but it's a fun bit.",
    "isRecorded": true
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "People Host",
    "text": ">> This isn't them. Something's going on.",
    "isRecorded": true
  },
  {
    "time": "01:24",
    "seconds": 84,
    "speaker": "People Host",
    "text": ">> Do you feel like you can ever change your hair color?",
    "isRecorded": true
  },
  {
    "time": "01:27",
    "seconds": 87,
    "speaker": "People Host",
    "text": ">> Oh, I get that question a lot.",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "People Host",
    "text": ">> Are you being annoying this whole press thing? You've just been >> weird.",
    "isRecorded": true
  },
  {
    "time": "01:32",
    "seconds": 92,
    "speaker": "People Host",
    "text": ">> Okay, you're the Twink. Do you want her to ask you about sucking >> I'm sure that you could see it on my face as I was going, \"Huh.\"",
    "isRecorded": true
  },
  {
    "time": "01:39",
    "seconds": 99,
    "speaker": "People Host",
    "text": ">> Are you being weird cuz like relationship stuff? What do you mean you're being weird cuz of relationship stuff?",
    "isRecorded": true
  },
  {
    "time": "01:43",
    "seconds": 103,
    "speaker": "People Host",
    "text": ">> Sorry, I don't think Do you even You don't want to talk about this, do you?",
    "isRecorded": true
  },
  {
    "time": "01:46",
    "seconds": 106,
    "speaker": "People Host",
    "text": ">> Not really.",
    "isRecorded": true
  },
  {
    "time": "01:46",
    "seconds": 106,
    "speaker": "People Host",
    "text": ">> Yeah.",
    "isRecorded": true
  },
  {
    "time": "01:47",
    "seconds": 107,
    "speaker": "People Host",
    "text": ">> This is going south fast.",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "People Host",
    "text": ">> She's the redhead. That's all she gets.",
    "isRecorded": true
  },
  {
    "time": "01:50",
    "seconds": 110,
    "speaker": "People Host",
    "text": ">> It's fine. Um I'll be fine.",
    "isRecorded": true
  },
  {
    "time": "01:52",
    "seconds": 112,
    "speaker": "People Host",
    "text": ">> thing about you. Well, I didn't mean it like that.",
    "isRecorded": true
  },
  {
    "time": "01:55",
    "seconds": 115,
    "speaker": "People Host",
    "text": ">> Oh I'm supposed to take my birth control.",
    "isRecorded": true
  },
  {
    "time": "01:58",
    "seconds": 118,
    "speaker": "People Host",
    "text": ">> Can I what?",
    "isRecorded": true
  },
  {
    "time": "01:58",
    "seconds": 118,
    "speaker": "People Host",
    "text": ">> Do you mind if I just have >> I do >> good?",
    "isRecorded": true
  },
  {
    "time": "02:00",
    "seconds": 120,
    "speaker": "People Host",
    "text": ">> Go take it. Oh my god I can't do another pregnancy scare.",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "People Host",
    "text": ">> You should not have taken that out of all.",
    "isRecorded": true
  },
  {
    "time": "02:05",
    "seconds": 125,
    "speaker": "People Host",
    "text": ">> [laughter] >> You guys have another one?",
    "isRecorded": true
  },
  {
    "time": "02:07",
    "seconds": 127,
    "speaker": "People Host",
    "text": ">> Huh?",
    "isRecorded": true
  },
  {
    "time": "02:08",
    "seconds": 128,
    "speaker": "People Host",
    "text": ">> No shade but it's kind of crazy you're smiling when he's like literally [music] really upset.",
    "isRecorded": true
  },
  {
    "time": "02:13",
    "seconds": 133,
    "speaker": "People Host",
    "text": ">> No you're right I'm so sorry.",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "People Host",
    "text": ">> It's the worst interview of my life.",
    "isRecorded": true
  },
  {
    "time": "02:17",
    "seconds": 137,
    "speaker": "People Host",
    "text": ">> We have 30 seconds.",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "People Host",
    "text": ">> [music] >> What's the biggest fight you guys have ever had?",
    "isRecorded": true
  },
  {
    "time": "02:21",
    "seconds": 141,
    "speaker": "People Host",
    "text": ">> [laughter] >> I don't know if I want to talk about that.",
    "isRecorded": true
  },
  {
    "time": "02:23",
    "seconds": 143,
    "speaker": "People Host",
    "text": ">> Sorry.",
    "isRecorded": true
  },
  {
    "time": "02:24",
    "seconds": 144,
    "speaker": "People Host",
    "text": ">> okay.",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "People Host",
    "text": ">> Thank you guys so much.",
    "isRecorded": true
  },
  {
    "time": "02:26",
    "seconds": 146,
    "speaker": "People Host",
    "text": ">> Oh my god thank you so much.",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "People Host",
    "text": ">> Oh my god you got to take your birth control.",
    "isRecorded": true
  },
  {
    "time": "02:30",
    "seconds": 150,
    "speaker": "People Host",
    "text": ">> That's the only thing more important than journalism.",
    "isRecorded": true
  },
  {
    "time": "02:32",
    "seconds": 152,
    "speaker": "People Host",
    "text": ">> Yes. That is a very relatable interview.",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "People Host",
    "text": "I'm sorry.",
    "isRecorded": true
  },
  {
    "time": "02:35",
    "seconds": 155,
    "speaker": "People Host",
    "text": ">> That could be a viral moment.",
    "isRecorded": true
  },
  {
    "time": "02:37",
    "seconds": 157,
    "speaker": "People Host",
    "text": ">> Can you ask them not to include the Bill Cosby stuff?",
    "isRecorded": true
  },
  {
    "time": "02:39",
    "seconds": 159,
    "speaker": "People Host",
    "text": ">> Yeah that was bad.",
    "isRecorded": true
  },
  {
    "time": "02:40",
    "seconds": 160,
    "speaker": "People Host",
    "text": ">> lost control.",
    "isRecorded": true
  },
  {
    "time": "02:41",
    "seconds": 161,
    "speaker": "People Host",
    "text": ">> I'm giving this one a gentleman's C.",
    "isRecorded": true
  },
  {
    "time": "02:43",
    "seconds": 163,
    "speaker": "People Host",
    "text": ">> C's get degrees.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "People Host",
    "text": ">> I just feel like you guys are going to have a lot of publicists [music] calling you after these interviews today asking for you to never air them.",
    "isRecorded": true
  },
  {
    "time": "02:50",
    "seconds": 170,
    "speaker": "People Host",
    "text": ">> WHERE IS MY BASKETBALL?",
    "isRecorded": true
  },
  {
    "time": "02:52",
    "seconds": 172,
    "speaker": "People Host",
    "text": ">> One of you has to say goodbye.",
    "isRecorded": true
  },
  {
    "time": "02:54",
    "seconds": 174,
    "speaker": "People Host",
    "text": ">> [music]",
    "isRecorded": true
  }
],
  "cnhTr8SBjVg": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "People Host",
    "text": "Today took me for a true emotional roller coaster.",
    "isRecorded": true
  },
  {
    "time": "00:03",
    "seconds": 3,
    "speaker": "People Host",
    "text": ">> What?",
    "isRecorded": true
  },
  {
    "time": "00:04",
    "seconds": 4,
    "speaker": "People Host",
    "text": ">> This is not a beauty pageant or a fashion show. This is about making a look for the red carpet.",
    "isRecorded": true
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "People Host",
    "text": ">> You're composing a whole thing that has to work in a cohesive way.",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "People Host",
    "text": ">> Quick and dirty, who is in your top?",
    "isRecorded": true
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "People Host",
    "text": ">> Brendan.",
    "isRecorded": true
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "People Host",
    "text": ">> He looked amazing. I also had Carlie up there. [music] >> The tie moment.",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "People Host",
    "text": ">> moment.",
    "isRecorded": true
  },
  {
    "time": "00:21",
    "seconds": 21,
    "speaker": "People Host",
    "text": ">> Lizzie's outfit was a vibe. Jack, I'm astounded by how basic that outfit was.",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "People Host",
    "text": ">> Alex versus Danielle, what do we do?",
    "isRecorded": true
  },
  {
    "time": "00:27",
    "seconds": 27,
    "speaker": "People Host",
    "text": ">> Alex. [music] It was a lot.",
    "isRecorded": true
  },
  {
    "time": "00:29",
    "seconds": 29,
    "speaker": "People Host",
    "text": ">> Even like when we were in the dressing room, I was like, \"Mhm.\" I saw a glance, I'm like, \"Mhm.\" >> I like Danny's, but it was not 100%",
    "isRecorded": true
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "People Host",
    "text": "there. [music] >> Some of the accessories didn't really match. It's not her fault.",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "People Host",
    "text": ">> bring them back in and mhm.",
    "isRecorded": true
  },
  {
    "time": "00:41",
    "seconds": 41,
    "speaker": "People Host",
    "text": ">> Let's start with the good news. The winner Brendan.",
    "isRecorded": true
  },
  {
    "time": "00:45",
    "seconds": 45,
    "speaker": "People Host",
    "text": ">> YEAH! >> [cheering] >> UNANIMOUS CHOICE. Very impressive look.",
    "isRecorded": true
  },
  {
    "time": "00:49",
    "seconds": 49,
    "speaker": "People Host",
    "text": ">> Good for him. He has good style.",
    "isRecorded": true
  },
  {
    "time": "00:51",
    "seconds": 51,
    "speaker": "People Host",
    "text": ">> To his credit, the way he used the scarf was very creative.",
    "isRecorded": true
  },
  {
    "time": "00:55",
    "seconds": 55,
    "speaker": "People Host",
    "text": ">> I love how you just put the scarf, cut it up, and just made it into your own.",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "People Host",
    "text": ">> Brendan had made the scarf into a pocket square, and then he was wondering if he needed another piece. I suggested that he wear it as a neck piece. I held the",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "People Host",
    "text": "piece of fabric up as he cut it, and then I tied it around his neck, and then he won the competition. Great.",
    "isRecorded": true
  },
  {
    "time": "01:16",
    "seconds": 76,
    "speaker": "People Host",
    "text": ">> Now the hard part. Not one, but two of you will be turning in your microphone.",
    "isRecorded": true
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "People Host",
    "text": "Taylen, [music] lay down the hammer.",
    "isRecorded": true
  },
  {
    "time": "01:26",
    "seconds": 86,
    "speaker": "People Host",
    "text": ">> It's going to be Jack. I'm so sorry.",
    "isRecorded": true
  },
  {
    "time": "01:28",
    "seconds": 88,
    "speaker": "People Host",
    "text": "[laughter] >> What?",
    "isRecorded": true
  },
  {
    "time": "01:30",
    "seconds": 90,
    "speaker": "People Host",
    "text": ">> I'm eliminated by a 13-year-old.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "People Host",
    "text": ">> Thank you.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "People Host",
    "text": ">> Your red carpet [music] ends here.",
    "isRecorded": true
  },
  {
    "time": "01:35",
    "seconds": 95,
    "speaker": "People Host",
    "text": ">> I feel bad. [laughter] >> These these are the breaks.",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "People Host",
    "text": ">> We still have to say [music] goodbye to another one of you today. Unless you have the immunity microphone. [music] If you do, I would play it now.",
    "isRecorded": true
  },
  {
    "time": "01:47",
    "seconds": 107,
    "speaker": "People Host",
    "text": ">> Might this be what you're looking for, Janine?",
    "isRecorded": true
  },
  {
    "time": "01:50",
    "seconds": 110,
    "speaker": "People Host",
    "text": ">> I knew you had something.",
    "isRecorded": true
  },
  {
    "time": "01:52",
    "seconds": 112,
    "speaker": "People Host",
    "text": ">> [music] >> I've uncovered an immunity challenge.",
    "isRecorded": true
  },
  {
    "time": "01:58",
    "seconds": 118,
    "speaker": "People Host",
    "text": ">> Wow, she really is good at this game.",
    "isRecorded": true
  },
  {
    "time": "02:00",
    "seconds": 120,
    "speaker": "People Host",
    "text": "She didn't tell a single one of us that she had that immunity idol.",
    "isRecorded": true
  },
  {
    "time": "02:04",
    "seconds": 124,
    "speaker": "People Host",
    "text": ">> But it comes with strings. Be a reporter, find a celebrity to endorse you.",
    "isRecorded": true
  },
  {
    "time": "02:09",
    "seconds": 129,
    "speaker": "People Host",
    "text": ">> This is Tucker Wetmore. He's a country singer and one of my pals.",
    "isRecorded": true
  },
  {
    "time": "02:12",
    "seconds": 132,
    "speaker": "People Host",
    "text": ">> What's up people? It's Tuck. Alex got my vote. Best red carpet reporter, hands down.",
    "isRecorded": true
  },
  {
    "time": "02:17",
    "seconds": 137,
    "speaker": "People Host",
    "text": ">> Okay, who was next on the chopping block?",
    "isRecorded": true
  },
  {
    "time": "02:20",
    "seconds": 140,
    "speaker": "People Host",
    "text": "Daniella.",
    "isRecorded": true
  },
  {
    "time": "02:21",
    "seconds": 141,
    "speaker": "People Host",
    "text": "I'm so sorry.",
    "isRecorded": true
  },
  {
    "time": "02:23",
    "seconds": 143,
    "speaker": "People Host",
    "text": ">> That's okay.",
    "isRecorded": true
  },
  {
    "time": "02:24",
    "seconds": 144,
    "speaker": "People Host",
    "text": ">> I am shocked.",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "People Host",
    "text": ">> Music team out.",
    "isRecorded": true
  },
  {
    "time": "02:26",
    "seconds": 146,
    "speaker": "People Host",
    "text": ">> If I looked like that in that dress one day in my life, honestly, I could die happy.",
    "isRecorded": true
  },
  {
    "time": "02:31",
    "seconds": 151,
    "speaker": "People Host",
    "text": ">> I thought I looked pretty good. Is it silly because of my scarf? Yes, but is it something that I would wear on a red carpet? Absolutely. You know, I think",
    "isRecorded": true
  },
  {
    "time": "02:38",
    "seconds": 158,
    "speaker": "People Host",
    "text": "oversized blazers are in.",
    "isRecorded": true
  },
  {
    "time": "02:40",
    "seconds": 160,
    "speaker": "People Host",
    "text": ">> Daniella and I wore the khaki jacket that gets you eliminated. You know who else was wearing a khaki jacket?",
    "isRecorded": true
  },
  {
    "time": "02:45",
    "seconds": 165,
    "speaker": "People Host",
    "text": "Charlotte. [music] >> Congratulations to the final four.",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "People Host",
    "text": ">> It feels really good to win.",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "People Host",
    "text": ">> [music] >> This bodes pretty well for the foreseeable future.",
    "isRecorded": true
  },
  {
    "time": "02:54",
    "seconds": 174,
    "speaker": "People Host",
    "text": ">> We should not take it out on the ball.",
    "isRecorded": true
  },
  {
    "time": "02:56",
    "seconds": 176,
    "speaker": "People Host",
    "text": ">> You guys have another one?",
    "isRecorded": true
  },
  {
    "time": "02:57",
    "seconds": 177,
    "speaker": "People Host",
    "text": ">> Huh?",
    "isRecorded": true
  }
],
  "gXJDtPkl9Ek": [
  {
    "time": "00:01",
    "seconds": 1,
    "speaker": "People Host",
    "text": "On September 11th, it was a regular day for me. I woke up, got ready for work, kissed Allison goodbye, and then I would kiss her belly goodbye.",
    "isRecorded": true
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "People Host",
    "text": "My post that day was the corner of 42nd and 8th Avenue, and I was just standing there doing my job, watching people come out. I had an awning above my head with",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "People Host",
    "text": "8th Avenue behind me. When I looked over to the corner of 42nd and 8th Avenue, that whole intersection went dark. It just like a shadow came over.",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "People Host",
    "text": "Our radios crackled, and they said, \"All units, 8:40,\" which is our code for everybody come back to the police desk.",
    "isRecorded": true
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "People Host",
    "text": "I met up with my fellow officer, Dominic Pizzulo. He said, \"Willie, something bad really must have happened.\" They had never called every single officer back",
    "isRecorded": true
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "People Host",
    "text": "to the police desk during the tour, especially during the rush.",
    "isRecorded": true
  },
  {
    "time": "00:48",
    "seconds": 48,
    "speaker": "People Host",
    "text": "We looked up at the police desk where our lieutenants, our sergeants are, and I remember looking up and seeing Sergeant John McLoughlin, someone who I",
    "isRecorded": true
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "People Host",
    "text": "admired. I had been to various calls with him that were very hairy, but he always led with professionalism and knowledge, but I could see concern in",
    "isRecorded": true
  },
  {
    "time": "01:03",
    "seconds": 63,
    "speaker": "People Host",
    "text": "his face.",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "People Host",
    "text": ">> A three-alarm fire and a report of an explosion.",
    "isRecorded": true
  },
  {
    "time": "01:06",
    "seconds": 66,
    "speaker": "People Host",
    "text": ">> New York 1 was on the New York news station, and all I can see is Tower 1 with a big black gaping hole in it. Our inspector came from the police desk and",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "People Host",
    "text": "said, \"Listen up, we're going to be calling your guys' names. We've commandeered a bus on 9th Avenue.",
    "isRecorded": true
  },
  {
    "time": "01:20",
    "seconds": 80,
    "speaker": "People Host",
    "text": "We're going down to help our brothers and sisters at the World Trade Center with the evacuation.\" I just remember stepping off and",
    "isRecorded": true
  },
  {
    "time": "01:27",
    "seconds": 87,
    "speaker": "People Host",
    "text": "thinking, \"Oh my god, I never thought I would see this.\" I don't even know how to describe it. It's a war zone. Dust, concrete, pieces of the plane,",
    "isRecorded": true
  },
  {
    "time": "01:35",
    "seconds": 95,
    "speaker": "People Host",
    "text": "unfortunately human remains. What we didn't know was that when we were en route from midtown Manhattan downtown, a second plane had hit. So, I couldn't see",
    "isRecorded": true
  },
  {
    "time": "01:43",
    "seconds": 103,
    "speaker": "People Host",
    "text": "the big black gaping hole on the other side of the second tower.",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "People Host",
    "text": "I could see people jumping from Tower 1, and all I could think about is like how you take a rock and you throw it in the water and you get that ripple effect.",
    "isRecorded": true
  },
  {
    "time": "01:56",
    "seconds": 116,
    "speaker": "People Host",
    "text": "Every time somebody jumped, that was somebody's mother, brother, sister. The list goes on.",
    "isRecorded": true
  }
],
  "UBazy_vbL90": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "People Host",
    "text": "When we hit that hallway, that's the first time I said, \"Will, what did you get yourself into?\" As I'm looking into the lobby, there are",
    "isRecorded": true
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "People Host",
    "text": "people who are dead, there are people running, and then all of a sudden we hear a humongous boom. And I look back from where we came, and I'm looking back",
    "isRecorded": true
  },
  {
    "time": "00:16",
    "seconds": 16,
    "speaker": "People Host",
    "text": "again into the lobby of two, and I see a fireball, I mean, the size of my house.",
    "isRecorded": true
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "People Host",
    "text": "The only way I can describe it's like a million freight trains just coming down on you.",
    "isRecorded": true
  },
  {
    "time": "00:29",
    "seconds": 29,
    "speaker": "People Host",
    "text": "The war of the devil just coming down on you. And at that point, I just kind of covered up and held on for dear life, and all of a sudden,",
    "isRecorded": true
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "People Host",
    "text": "it was silence.",
    "isRecorded": true
  },
  {
    "time": "00:37",
    "seconds": 37,
    "speaker": "People Host",
    "text": "And I open my eyes, and it was pitch dark.",
    "isRecorded": true
  },
  {
    "time": "00:43",
    "seconds": 43,
    "speaker": "People Host",
    "text": "There was a hole above us about 30 ft up, and light started, you know, filtering in, and I All I could see was gray. Dominic was buried next to me, to",
    "isRecorded": true
  },
  {
    "time": "00:51",
    "seconds": 51,
    "speaker": "People Host",
    "text": "my left, at right by my hip area. And Sergeant McLoughlin, in the initial collapse, was actually trapped in a fetal position. He was just trapped.",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "People Host",
    "text": "And he then said, \"Sound off.\" So, I said, \"Jimeno.\" And Dominic said, \"Puzzulo.\" And then I didn't hear the guys.",
    "isRecorded": true
  },
  {
    "time": "01:10",
    "seconds": 70,
    "speaker": "People Host",
    "text": "That's when we realized we lost two fellow officers, you know, two fathers, two sons, two great Americans. And that was hard. And that's when I started",
    "isRecorded": true
  },
  {
    "time": "01:17",
    "seconds": 77,
    "speaker": "People Host",
    "text": "feeling the pain. I think my shock was wearing off.",
    "isRecorded": true
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "People Host",
    "text": "Sergeant McLoughlin said, \"What is everybody's condition?\" And I said, \"I can't move. I'm buried. I'm I'm literally being crushed.\" Dominic said,",
    "isRecorded": true
  },
  {
    "time": "01:31",
    "seconds": 91,
    "speaker": "People Host",
    "text": "\"I'm okay, but I'm stuck.\" He was able to wiggle his way through to this small area to our right-hand side, and he was looking up, and he said, \"Sarge, I can",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "People Host",
    "text": "go up and get help.\" And Sergeant McLoughlin said, \"No, get Jimeno out, and you and Jimeno get me out, because if you go out there, you'll never find",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "People Host",
    "text": "us again. It's a debris field.\" And that's when we heard another humongous boom.",
    "isRecorded": true
  },
  {
    "time": "01:57",
    "seconds": 117,
    "speaker": "People Host",
    "text": "And everything starts coming through again. this point now, I can hear Sergeant McLaughlin yelling.",
    "isRecorded": true
  },
  {
    "time": "02:02",
    "seconds": 122,
    "speaker": "People Host",
    "text": "Because now he is being crushed.",
    "isRecorded": true
  },
  {
    "time": "02:04",
    "seconds": 124,
    "speaker": "People Host",
    "text": ">> Go, go, go.",
    "isRecorded": true
  },
  {
    "time": "02:05",
    "seconds": 125,
    "speaker": "People Host",
    "text": ">> I'm being more crushed because there's more concrete and everything hitting me.",
    "isRecorded": true
  },
  {
    "time": "02:10",
    "seconds": 130,
    "speaker": "People Host",
    "text": "I did this, which in sign language means I love you. And I crossed my arms because I figured that's the way I was going to die. And if they found me, they",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "People Host",
    "text": "would tell Allison that I was saying I love you because that's what I would do to Allison and my little girl Bianca is always say I love",
    "isRecorded": true
  },
  {
    "time": "02:24",
    "seconds": 144,
    "speaker": "People Host",
    "text": "you.",
    "isRecorded": true
  }
],
  "PaLVUPSIXHM": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "CNBC Reporter",
    "text": "More than 2200 people help \nrun elections in Delaware County, Pennsylvania, \nincluding poll workers and people handling ballots.",
    "isRecorded": true
  },
  {
    "time": "00:07",
    "seconds": 7,
    "speaker": "CNBC Reporter",
    "text": "They now have to agree not \nto participate in prediction market activity.",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "CNBC Reporter",
    "text": "We were one of the first \njurisdictions anywhere to put a spotlight on this, \nand we decided we had oats that all of our poll workers \ntook in the precincts.",
    "isRecorded": true
  },
  {
    "time": "00:23",
    "seconds": 23,
    "speaker": "CNBC Reporter",
    "text": "That included promising not \nto have any interest, indirect or direct in any \nbet or wager.",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "CNBC Reporter",
    "text": "And we amended that to \ninclude prediction market.",
    "isRecorded": true
  },
  {
    "time": "00:31",
    "seconds": 31,
    "speaker": "CNBC Reporter",
    "text": "Pennsylvania law already \nbars certain poll workers from having an interest in a \nbet or wager on an election outcome. This means workers \ncan face termination fines",
    "isRecorded": true
  },
  {
    "time": "00:40",
    "seconds": 40,
    "speaker": "CNBC Reporter",
    "text": "or other misdemeanor charges \nif they violate that condition. But the law, \nas written, does not specifically \naddress prediction market",
    "isRecorded": true
  },
  {
    "time": "00:47",
    "seconds": 47,
    "speaker": "CNBC Reporter",
    "text": "activity. Kalshi and \nPolymarket call this activity trading, \nwhich they distinguish from betting or wagering.",
    "isRecorded": true
  },
  {
    "time": "00:53",
    "seconds": 53,
    "speaker": "CNBC Reporter",
    "text": "But Jim Allen, \nthe Election Director in the county, considers prediction \nmarkets the same as gambling.",
    "isRecorded": true
  },
  {
    "time": "01:00",
    "seconds": 60,
    "speaker": "CNBC Reporter",
    "text": "I mean prediction markets, \neven though they claim they're not bets or wagers, \nthey operate exactly like the horse track.",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "CNBC Reporter",
    "text": "To be clear, there is no \npublic evidence that election workers are using \nprediction markets, but Pennsylvania officials \nsay they want the rules in",
    "isRecorded": true
  },
  {
    "time": "01:14",
    "seconds": 74,
    "speaker": "CNBC Reporter",
    "text": "place before it becomes a \nproblem.",
    "isRecorded": true
  },
  {
    "time": "01:16",
    "seconds": 76,
    "speaker": "CNBC Reporter",
    "text": "I think people would lose \nfaith if there were any people who were central to \nthe count in any given jurisdiction, who had money \none way or the other in",
    "isRecorded": true
  },
  {
    "time": "01:25",
    "seconds": 85,
    "speaker": "CNBC Reporter",
    "text": "a prediction market.",
    "isRecorded": true
  },
  {
    "time": "01:32",
    "seconds": 92,
    "speaker": "CNBC Reporter",
    "text": "Delaware County is not \nalone.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "CNBC Reporter",
    "text": "Maricopa County, \nArizona, adopted a similar policy covering roughly \n13,000 county employees.",
    "isRecorded": true
  },
  {
    "time": "01:40",
    "seconds": 100,
    "speaker": "CNBC Reporter",
    "text": "It bars them from trading on \nnonpublic information tied to the county's business, \nsuch as outcomes in court cases and elections.",
    "isRecorded": true
  },
  {
    "time": "01:47",
    "seconds": 107,
    "speaker": "CNBC Reporter",
    "text": "Imagine if we did not have \nthis policy, and no one of our employees \ndid something like this, in which they acted with \nulterior motives in a",
    "isRecorded": true
  },
  {
    "time": "01:54",
    "seconds": 114,
    "speaker": "CNBC Reporter",
    "text": "prediction market.",
    "isRecorded": true
  },
  {
    "time": "01:55",
    "seconds": 115,
    "speaker": "CNBC Reporter",
    "text": "But then after an election, \nsomeone was upset with the results, accused of her \nemployees of doing something like that to enrich \nthemselves.",
    "isRecorded": true
  },
  {
    "time": "02:02",
    "seconds": 122,
    "speaker": "CNBC Reporter",
    "text": "Arizona law separately makes \nelection wagers a misdemeanor. But again, \nthe prediction market industry disputes \ncharacterizing its markets",
    "isRecorded": true
  },
  {
    "time": "02:11",
    "seconds": 131,
    "speaker": "CNBC Reporter",
    "text": "as gambling in general.",
    "isRecorded": true
  },
  {
    "time": "02:13",
    "seconds": 133,
    "speaker": "CNBC Reporter",
    "text": "The Arizona attorney general \nis now fighting about that distinction in court.",
    "isRecorded": true
  },
  {
    "time": "02:19",
    "seconds": 139,
    "speaker": "CNBC Reporter",
    "text": "As of June 2026, \nelection betting for all people, not just election \nworkers, was illegal in some or all \ncircumstances in 32 states,",
    "isRecorded": true
  },
  {
    "time": "02:27",
    "seconds": 147,
    "speaker": "CNBC Reporter",
    "text": "including full bans in 23.",
    "isRecorded": true
  },
  {
    "time": "02:30",
    "seconds": 150,
    "speaker": "CNBC Reporter",
    "text": "I think one of the first few \nissues or concerns that I had is whether or not this \nis gambling, and I think that's a debate \nthat's been raging on right",
    "isRecorded": true
  },
  {
    "time": "02:38",
    "seconds": 158,
    "speaker": "CNBC Reporter",
    "text": "now in D.C. in terms of how \ndo you regulate that?",
    "isRecorded": true
  },
  {
    "time": "02:40",
    "seconds": 160,
    "speaker": "CNBC Reporter",
    "text": "The difference between \nprediction markets and gambling or sports gambling.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "CNBC Reporter",
    "text": "This raises a question about \nregulation, right. And safeguards.",
    "isRecorded": true
  },
  {
    "time": "02:47",
    "seconds": 167,
    "speaker": "CNBC Reporter",
    "text": "What levels and levers of \ngovernment are going to step in to provide some guidance?",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "CNBC Reporter",
    "text": "A big concern is around \ninformation the public does not have yet. For example, \nabout 80% of Maricopa County's ballots arrive \nthrough early and mail",
    "isRecorded": true
  },
  {
    "time": "03:00",
    "seconds": 180,
    "speaker": "CNBC Reporter",
    "text": "voting. Election workers \nprocess those ballots before election results are \nreleased on election night.",
    "isRecorded": true
  },
  {
    "time": "03:05",
    "seconds": 185,
    "speaker": "CNBC Reporter",
    "text": "So we are tabulating right \nthrough Election Day.",
    "isRecorded": true
  },
  {
    "time": "03:08",
    "seconds": 188,
    "speaker": "CNBC Reporter",
    "text": "We don't announce the \nresults until after the polls are closed, \nbut a lot of people have access to these ballots.",
    "isRecorded": true
  },
  {
    "time": "03:13",
    "seconds": 193,
    "speaker": "CNBC Reporter",
    "text": "Obviously, there's a lot of \nwhat I would call redundancies in the system, \na lot of oversight in the system. There are bipartisan \nboards throughout,",
    "isRecorded": true
  },
  {
    "time": "03:20",
    "seconds": 200,
    "speaker": "CNBC Reporter",
    "text": "but I do worry about if \npeople have access to nonpublic information, \nthat they would then turn around and engage in these \nprediction markets.",
    "isRecorded": true
  },
  {
    "time": "03:27",
    "seconds": 207,
    "speaker": "CNBC Reporter",
    "text": "That doesn't mean that \nelection officials are, you know, violating their \noath oath of office.",
    "isRecorded": true
  },
  {
    "time": "03:31",
    "seconds": 211,
    "speaker": "CNBC Reporter",
    "text": "But this creates a lot of \nquestions about where's the line. And that then can \ntrickle down to voter trust.",
    "isRecorded": true
  },
  {
    "time": "03:37",
    "seconds": 217,
    "speaker": "CNBC Reporter",
    "text": "Some are hopeful that \nelection officials can learn from how they've dealt with \nchanging technology from the past, such as confronting \nhow social media can",
    "isRecorded": true
  },
  {
    "time": "03:45",
    "seconds": 225,
    "speaker": "CNBC Reporter",
    "text": "interfere with elections.",
    "isRecorded": true
  },
  {
    "time": "03:47",
    "seconds": 227,
    "speaker": "CNBC Reporter",
    "text": "I can imagine across the \ncountry, election officials are \npulling out the playbook for how they've responded, \ntaking the good things that",
    "isRecorded": true
  },
  {
    "time": "03:55",
    "seconds": 235,
    "speaker": "CNBC Reporter",
    "text": "they've done in the past and \ncontinuing to do more of those as it relates to \npredictive markets and their impact.",
    "isRecorded": true
  },
  {
    "time": "04:05",
    "seconds": 245,
    "speaker": "CNBC Reporter",
    "text": "The other concerns election \nofficials are raising is how prediction market activity \nmay be affecting races.",
    "isRecorded": true
  },
  {
    "time": "04:10",
    "seconds": 250,
    "speaker": "CNBC Reporter",
    "text": "I have seen when I travel \nthe district and when I travel the county, \nthat some people confuse the numbers reflected in \nprediction markets with",
    "isRecorded": true
  },
  {
    "time": "04:18",
    "seconds": 258,
    "speaker": "CNBC Reporter",
    "text": "public opinion polling.",
    "isRecorded": true
  },
  {
    "time": "04:19",
    "seconds": 259,
    "speaker": "CNBC Reporter",
    "text": "Just because someone has a \n98% chance of winning on a prediction market doesn't \nmean that they're winning in the polls 98 to 2.",
    "isRecorded": true
  },
  {
    "time": "04:26",
    "seconds": 266,
    "speaker": "CNBC Reporter",
    "text": "On a prediction market \nplatform traders buy and sell contracts tied to an \nevent.",
    "isRecorded": true
  },
  {
    "time": "04:30",
    "seconds": 270,
    "speaker": "CNBC Reporter",
    "text": "An event is anything with a \nyes or no outcome.",
    "isRecorded": true
  },
  {
    "time": "04:33",
    "seconds": 273,
    "speaker": "CNBC Reporter",
    "text": "So will a candidate win?",
    "isRecorded": true
  },
  {
    "time": "04:34",
    "seconds": 274,
    "speaker": "CNBC Reporter",
    "text": "Their primary race is a \nclear cut example of an event. A contract that pays \n$1.",
    "isRecorded": true
  },
  {
    "time": "04:39",
    "seconds": 279,
    "speaker": "CNBC Reporter",
    "text": "If a candidate wins, \nmight trade for $0.70.",
    "isRecorded": true
  },
  {
    "time": "04:42",
    "seconds": 282,
    "speaker": "CNBC Reporter",
    "text": "So that price is often read \nas the candidate having roughly a 70% chance of \nwinning.",
    "isRecorded": true
  },
  {
    "time": "04:48",
    "seconds": 288,
    "speaker": "CNBC Reporter",
    "text": "But that price is not a \npoll, and it is not an official \nprojection or election result. It moves as traders \nreact to information and",
    "isRecorded": true
  },
  {
    "time": "04:56",
    "seconds": 296,
    "speaker": "CNBC Reporter",
    "text": "place new trades.",
    "isRecorded": true
  },
  {
    "time": "04:58",
    "seconds": 298,
    "speaker": "CNBC Reporter",
    "text": "In fact, as one professor \ntold me, election contracts provide \nlive results, whereas polls take a longer \ntime to release odds and",
    "isRecorded": true
  },
  {
    "time": "05:06",
    "seconds": 306,
    "speaker": "CNBC Reporter",
    "text": "gambling platforms do not \nuse methodologies used by traditional political \npolling, so they are not substitutes \nfor political polls.",
    "isRecorded": true
  },
  {
    "time": "05:14",
    "seconds": 314,
    "speaker": "CNBC Reporter",
    "text": "What those markets are doing \nare very distinct from established forecasting \nmodels, and they're very distinct \nfrom pre-election polls.",
    "isRecorded": true
  },
  {
    "time": "05:21",
    "seconds": 321,
    "speaker": "CNBC Reporter",
    "text": "They do very different \nthings.",
    "isRecorded": true
  },
  {
    "time": "05:23",
    "seconds": 323,
    "speaker": "CNBC Reporter",
    "text": "The concern is that those \ndistinctions can get blurry when prediction market \nprices appear beside polling data or other election \ncoverage.",
    "isRecorded": true
  },
  {
    "time": "05:32",
    "seconds": 332,
    "speaker": "CNBC Reporter",
    "text": "A survey found nearly 4 in \n10 likely midterm voters thought prediction market \nodds reflected counted votes or an official projection.",
    "isRecorded": true
  },
  {
    "time": "05:40",
    "seconds": 340,
    "speaker": "CNBC Reporter",
    "text": "38% said a final result that \ndiffered from prediction market odds would reduce \ntheir confidence.",
    "isRecorded": true
  },
  {
    "time": "05:47",
    "seconds": 347,
    "speaker": "CNBC Reporter",
    "text": "Just because a candidate has \nhigh odds in a prediction market doesn't mean they're \ngoing to win.",
    "isRecorded": true
  },
  {
    "time": "05:52",
    "seconds": 352,
    "speaker": "CNBC Reporter",
    "text": "For example, ahead of the \nWisconsin Democratic primary for governor prediction, \nmarket traders priced Francesca Hong's chances of \nwinning at about 95%.",
    "isRecorded": true
  },
  {
    "time": "06:01",
    "seconds": 361,
    "speaker": "CNBC Reporter",
    "text": "She ended up losing to David \nCrowley by less than half a point. So that 95% can throw \npeople off because it reflects what traders think \nis going to happen,",
    "isRecorded": true
  },
  {
    "time": "06:10",
    "seconds": 370,
    "speaker": "CNBC Reporter",
    "text": "rather than an overview of \nlikely voters intentions, which is what a poll \nexamines.",
    "isRecorded": true
  },
  {
    "time": "06:16",
    "seconds": 376,
    "speaker": "CNBC Reporter",
    "text": "After Hong Lost Causes \nco-founder Tariq Mansoor responded on X to the \nbacklash on prediction market forecasting, \nstating a 5% probability",
    "isRecorded": true
  },
  {
    "time": "06:26",
    "seconds": 386,
    "speaker": "CNBC Reporter",
    "text": "doesn't mean it won't \nhappen.",
    "isRecorded": true
  },
  {
    "time": "06:27",
    "seconds": 387,
    "speaker": "CNBC Reporter",
    "text": "It means it should happen 1 \nin 20 times.",
    "isRecorded": true
  },
  {
    "time": "06:31",
    "seconds": 391,
    "speaker": "CNBC Reporter",
    "text": "If 5% candidates never won, \nthe market would be broken.",
    "isRecorded": true
  },
  {
    "time": "06:35",
    "seconds": 395,
    "speaker": "CNBC Reporter",
    "text": "A spokesperson for the \nplatform also noted a poll is a static snapshot, \nwhile a market on call sheet is a living forecast of the \nfuture call,",
    "isRecorded": true
  },
  {
    "time": "06:43",
    "seconds": 403,
    "speaker": "CNBC Reporter",
    "text": "she said it does not believe \nits platform is a replacement for polling, \nbut rather a complement to polling. A spokesperson for \nPolymarket did not directly",
    "isRecorded": true
  },
  {
    "time": "06:51",
    "seconds": 411,
    "speaker": "CNBC Reporter",
    "text": "respond to how the platform \ncan further step in and ensure voters do not confuse \nelection contracts with polls, but did reinstate \nthat the CFTC is the federal",
    "isRecorded": true
  },
  {
    "time": "07:00",
    "seconds": 420,
    "speaker": "CNBC Reporter",
    "text": "regulator, not states.",
    "isRecorded": true
  },
  {
    "time": "07:02",
    "seconds": 422,
    "speaker": "CNBC Reporter",
    "text": "State actions run counter to \nthe Cftc's establishment framework for regulating \nprediction markets, as courts have recognized, \nprediction markets on CFTC.",
    "isRecorded": true
  },
  {
    "time": "07:11",
    "seconds": 431,
    "speaker": "CNBC Reporter",
    "text": "Registered exchanges are \ngoverned by federal law, not a patchwork of state and \nlocal rules.",
    "isRecorded": true
  },
  {
    "time": "07:19",
    "seconds": 439,
    "speaker": "CNBC Reporter",
    "text": "Another question that comes \nout of this is how much a market price can be \ninfluenced by a small number of traders.",
    "isRecorded": true
  },
  {
    "time": "07:25",
    "seconds": 445,
    "speaker": "CNBC Reporter",
    "text": "Someone with $1 million can \ninfluence heavily what a prediction market is saying \nabout an upcoming event, and the same can happen in \nan election.",
    "isRecorded": true
  },
  {
    "time": "07:34",
    "seconds": 454,
    "speaker": "CNBC Reporter",
    "text": "The confusion about what the \ndifference is between the actual election results and \nwhat the prediction market said, it's bound to occur.",
    "isRecorded": true
  },
  {
    "time": "07:41",
    "seconds": 461,
    "speaker": "CNBC Reporter",
    "text": "Now, that's not quite the \nsame as changing an election outcome. But officials worry \nthat if prices move sharply, voters may not know whether \nit reflects new information.",
    "isRecorded": true
  },
  {
    "time": "07:51",
    "seconds": 471,
    "speaker": "CNBC Reporter",
    "text": "A few large trades or \nsomething else entirely.",
    "isRecorded": true
  },
  {
    "time": "07:55",
    "seconds": 475,
    "speaker": "CNBC Reporter",
    "text": "Obviously, we have no \ncontrol over prediction markets themselves or how \npeople react to them, or how they interpret those \nnumbers that are being",
    "isRecorded": true
  },
  {
    "time": "08:01",
    "seconds": 481,
    "speaker": "CNBC Reporter",
    "text": "published. But we can only \ncontrol over what we have jurisdiction over.",
    "isRecorded": true
  },
  {
    "time": "08:05",
    "seconds": 485,
    "speaker": "CNBC Reporter",
    "text": "And so when we implement a \npolicy for our employees not to trade or bet on nonpublic \ninformation, that goes a long way toward \nshowing people that not only",
    "isRecorded": true
  },
  {
    "time": "08:13",
    "seconds": 493,
    "speaker": "CNBC Reporter",
    "text": "are we working hard to \nmaintain transparent elections, but also shows \nthat we are being very aware of new technology.",
    "isRecorded": true
  },
  {
    "time": "08:21",
    "seconds": 501,
    "speaker": "CNBC Reporter",
    "text": "Platforms point to \nsafeguards caution requires identity verification, \nsays it monitors unusual trading activity, \nand checks whether campaign",
    "isRecorded": true
  },
  {
    "time": "08:29",
    "seconds": 509,
    "speaker": "CNBC Reporter",
    "text": "staffers and politicians are \nusing the platform using FEC data and its own logs.",
    "isRecorded": true
  },
  {
    "time": "08:34",
    "seconds": 514,
    "speaker": "CNBC Reporter",
    "text": "Meanwhile, back in April, \nPolymarket partnered with Chainalysis, a blockchain \ndata platform, to detect possible insider \ntrading patterns.",
    "isRecorded": true
  },
  {
    "time": "08:43",
    "seconds": 523,
    "speaker": "CNBC Reporter",
    "text": "Still, officials remain \ndoubtful on how helpful election contracts are for \nthe public.",
    "isRecorded": true
  },
  {
    "time": "08:49",
    "seconds": 529,
    "speaker": "CNBC Reporter",
    "text": "This monetizes the \npossibility of very deceptive bombshell reports \nemerging just days before Election Day. If someone has \na whole lot of money",
    "isRecorded": true
  },
  {
    "time": "08:59",
    "seconds": 539,
    "speaker": "CNBC Reporter",
    "text": "invested in a prediction \nmarket and you know, whether true or not, \nthey do their opposition research or they use AI to \ngenerate a phony video to",
    "isRecorded": true
  },
  {
    "time": "09:08",
    "seconds": 548,
    "speaker": "CNBC Reporter",
    "text": "muddy up the election for \nthe person who appears to be likely to win or to try to \nshave points off it to, you know, make their wager \ncome true.",
    "isRecorded": true
  },
  {
    "time": "09:17",
    "seconds": 557,
    "speaker": "CNBC Reporter",
    "text": "That's what I mean by these \nmarkets.",
    "isRecorded": true
  },
  {
    "time": "09:19",
    "seconds": 559,
    "speaker": "CNBC Reporter",
    "text": "Monetize cheating and \ngetting something tangible at the end of it. And that's \nthe danger.",
    "isRecorded": true
  },
  {
    "time": "09:26",
    "seconds": 566,
    "speaker": "CNBC Reporter",
    "text": "But critics say preventing \nelection workers from participating in prediction \nmarkets doesn't solve the problem entirely for \nelection officials.",
    "isRecorded": true
  },
  {
    "time": "09:34",
    "seconds": 574,
    "speaker": "CNBC Reporter",
    "text": "They've got to be ready to \ntalk about it.",
    "isRecorded": true
  },
  {
    "time": "09:36",
    "seconds": 576,
    "speaker": "CNBC Reporter",
    "text": "They've got to be ready to \nexplain how or how not those things are impacting \nelection administration more broadly.",
    "isRecorded": true
  },
  {
    "time": "09:44",
    "seconds": 584,
    "speaker": "CNBC Reporter",
    "text": "For now, counties such as \nDelaware and Maricopa are addressing the parts of this \nthat the election officials can control, which is \nwhether the people who are",
    "isRecorded": true
  },
  {
    "time": "09:52",
    "seconds": 592,
    "speaker": "CNBC Reporter",
    "text": "responsible for making the \nelections happen have a financial interest in the \noutcomes.",
    "isRecorded": true
  },
  {
    "time": "09:57",
    "seconds": 597,
    "speaker": "CNBC Reporter",
    "text": "But the broader questions \naround how these markets are regulated, how their prices \nare interpreted and how much influence they can have are \nstill being worked out.",
    "isRecorded": true
  }
],
  "9459rJ2hz1w": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "CNBC Reporter",
    "text": "This is called an ultra modern card. And generally we don't buy and secure ultra moderns because they haven't proven their value yet with the exception of",
    "isRecorded": true
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "CNBC Reporter",
    "text": "this card. This is the Otani one of one.",
    "isRecorded": true
  },
  {
    "time": "00:11",
    "seconds": 11,
    "speaker": "CNBC Reporter",
    "text": "It has his 2024 patch from most valuable player 2025 of the same. In both games he wore these patches one of a kind and",
    "isRecorded": true
  },
  {
    "time": "00:21",
    "seconds": 21,
    "speaker": "CNBC Reporter",
    "text": "he scored home runs.",
    "isRecorded": true
  },
  {
    "time": "00:23",
    "seconds": 23,
    "speaker": "CNBC Reporter",
    "text": "Then he signed this card after it was beautifully manufactured on gold on black which [music] makes it stunning.",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "CNBC Reporter",
    "text": "In English and in Japanese. Now, it was not rated at that time.",
    "isRecorded": true
  },
  {
    "time": "00:34",
    "seconds": 34,
    "speaker": "CNBC Reporter",
    "text": ">> [music] >> It's a company called PSA that rates these cards. So, we bought the card for 11 million dollars. Why 11? Because there was other people trying to get it.",
    "isRecorded": true
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "CNBC Reporter",
    "text": "It was basically collectors from around the world that knew about the card. They wanted [music] it too. Now, the way the card was found, this card itself was not",
    "isRecorded": true
  },
  {
    "time": "00:53",
    "seconds": 53,
    "speaker": "CNBC Reporter",
    "text": "in a package. This was. This card is called a redemption card. [music] It's put into one of a million plus packages and sent all around the world.",
    "isRecorded": true
  },
  {
    "time": "01:02",
    "seconds": 62,
    "speaker": "CNBC Reporter",
    "text": "You don't know who's going to get it.",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "CNBC Reporter",
    "text": "You have no idea. It's going out to card dealers and other places.",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "CNBC Reporter",
    "text": "A young man in Florida opened it on his kitchen [music] counter.",
    "isRecorded": true
  },
  {
    "time": "01:14",
    "seconds": 74,
    "speaker": "CNBC Reporter",
    "text": "Boom.",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "CNBC Reporter",
    "text": "He found it. He knew exactly what he had because he'd been collecting since he was a young child and he called in the redemption. [music] The code is on the",
    "isRecorded": true
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "CNBC Reporter",
    "text": "back.",
    "isRecorded": true
  },
  {
    "time": "01:23",
    "seconds": 83,
    "speaker": "CNBC Reporter",
    "text": "And that's when the bidding started. We had what's called an offer out there.",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "CNBC Reporter",
    "text": "It's called at 6.8 million, but other bounties were out there. The price kept going up. He wanted to sell [music] it to somebody that knew cards and that was Shine is",
    "isRecorded": true
  },
  {
    "time": "01:39",
    "seconds": 99,
    "speaker": "CNBC Reporter",
    "text": "his name. He's one of the partners of Secure.",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "CNBC Reporter",
    "text": "He sold it to Shine and it became part of the portfolio we're talking about in Secure. The card itself is stunning.",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "CNBC Reporter",
    "text": "It's sitting inside a one of a kind Tiffany necklace made of solid white gold, 110 carats of diamonds and a whole lot of beautiful rubies inset.",
    "isRecorded": true
  },
  {
    "time": "01:59",
    "seconds": 119,
    "speaker": "CNBC Reporter",
    "text": "What a beautiful piece of art. It's wearable art, that's what it is.",
    "isRecorded": true
  }
],
  "xtB5pyzHpnw": [
  {
    "time": "00:02",
    "seconds": 2,
    "speaker": "CNBC Reporter",
    "text": "Violent crime fell more than \n9% in 2025, but public concern remains \nwidespread.",
    "isRecorded": true
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "CNBC Reporter",
    "text": "Nearly 7 in 10 Americans say \nthey worry at least a fair amount about crime and \nviolence.",
    "isRecorded": true
  },
  {
    "time": "00:13",
    "seconds": 13,
    "speaker": "CNBC Reporter",
    "text": "In October 2025, \nGallup poll found that nearly half of Americans \nbelieved national crime had increased in the past year.",
    "isRecorded": true
  },
  {
    "time": "00:21",
    "seconds": 21,
    "speaker": "CNBC Reporter",
    "text": "At the same time, \na series of high profile attacks has kept corporate \nsecurity concerns front and center.",
    "isRecorded": true
  },
  {
    "time": "00:27",
    "seconds": 27,
    "speaker": "CNBC Reporter",
    "text": "Luigi Mangione just pleaded \nguilty to federal stalking charges and admitted in open \ncourt to killing UnitedHealthCare CEO Brian \nThompson.",
    "isRecorded": true
  },
  {
    "time": "00:36",
    "seconds": 36,
    "speaker": "CNBC Reporter",
    "text": "In 2024, unitedHealthcare \nCEO Brian Thompson was fatally shot in midtown \nManhattan.",
    "isRecorded": true
  },
  {
    "time": "00:42",
    "seconds": 42,
    "speaker": "CNBC Reporter",
    "text": "In 2025, four people were \nkilled after a gunman opened fire in a New York office \ntower housing the NFL and several major financial \ncompanies.",
    "isRecorded": true
  },
  {
    "time": "00:51",
    "seconds": 51,
    "speaker": "CNBC Reporter",
    "text": "The following year, \na man was arrested for allegedly throwing a Molotov \ncocktail at OpenAI CEO Sam Altman's home and \nthreatening the",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "CNBC Reporter",
    "text": "company's headquarters.",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "CNBC Reporter",
    "text": "When the CEO of \nUnitedHealthcare was gunned down in the street in New \nYork City, I think all of a sudden, \ncorporations realize that",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "CNBC Reporter",
    "text": "the need to protect high \nvalue personnel is important and so that's a growth area.",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "CNBC Reporter",
    "text": "Security back when we \nstarted was a budget item that you wanted to get rid \nof.",
    "isRecorded": true
  },
  {
    "time": "01:20",
    "seconds": 80,
    "speaker": "CNBC Reporter",
    "text": "Today, it's never coming out \nof our budget.",
    "isRecorded": true
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "CNBC Reporter",
    "text": "How do we reduce that \nbudget?",
    "isRecorded": true
  },
  {
    "time": "01:23",
    "seconds": 83,
    "speaker": "CNBC Reporter",
    "text": "Upwards of two-thirds of \nsecurity guards are earning a pay that classifies them \nas low wage workers.",
    "isRecorded": true
  },
  {
    "time": "01:32",
    "seconds": 92,
    "speaker": "CNBC Reporter",
    "text": "The training and pay and \nlabor standards of the job have not kept up with the \nincreasing responsibilities and riskiness of the job.",
    "isRecorded": true
  },
  {
    "time": "01:40",
    "seconds": 100,
    "speaker": "CNBC Reporter",
    "text": "The private security \nindustry in the US saw revenue top $50 billion in \n2025.",
    "isRecorded": true
  },
  {
    "time": "01:45",
    "seconds": 105,
    "speaker": "CNBC Reporter",
    "text": "It's seen a 17% increase \nover the last decade.",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "CNBC Reporter",
    "text": "Half of the security \nprofessionals surveyed said their budgets increased \nyear-over-year, with the average increase \nbeing 12%.",
    "isRecorded": true
  },
  {
    "time": "01:56",
    "seconds": 116,
    "speaker": "CNBC Reporter",
    "text": "A separate analysis found \nthat high profile incidents and increased public threats \nagainst executives were major drivers of that shift.",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "CNBC Reporter",
    "text": "So has this increased need \nfor private security created a new opportunity for the \nindustry?",
    "isRecorded": true
  },
  {
    "time": "02:17",
    "seconds": 137,
    "speaker": "CNBC Reporter",
    "text": "So obviously the police \nhandle violent crime.",
    "isRecorded": true
  },
  {
    "time": "02:19",
    "seconds": 139,
    "speaker": "CNBC Reporter",
    "text": "But a private security \nindustry has been growing that operates parallel to \nthe police in a lot of ways.",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "CNBC Reporter",
    "text": "About 40% of S&P 500 firms \nare spending on executive protection, including \nWalmart and TJ Maxx's parent company. Those companies \nmedian spend has more than",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "CNBC Reporter",
    "text": "doubled since 2019.",
    "isRecorded": true
  },
  {
    "time": "02:37",
    "seconds": 157,
    "speaker": "CNBC Reporter",
    "text": "At the center of that market \nis Allied Universal, a company many Americans \nencounter without realizing its scale.",
    "isRecorded": true
  },
  {
    "time": "02:43",
    "seconds": 163,
    "speaker": "CNBC Reporter",
    "text": "Allied Universal is by far \nthe largest guarding company in the world. Right?",
    "isRecorded": true
  },
  {
    "time": "02:48",
    "seconds": 168,
    "speaker": "CNBC Reporter",
    "text": "800,000 employees.",
    "isRecorded": true
  },
  {
    "time": "02:50",
    "seconds": 170,
    "speaker": "CNBC Reporter",
    "text": "We're everywhere.",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "CNBC Reporter",
    "text": "Allied provided hundreds of \nsecurity personnel to this year's World Cup.",
    "isRecorded": true
  },
  {
    "time": "02:55",
    "seconds": 175,
    "speaker": "CNBC Reporter",
    "text": "Even though it's not \npublicly traded.",
    "isRecorded": true
  },
  {
    "time": "02:57",
    "seconds": 177,
    "speaker": "CNBC Reporter",
    "text": "Allied universal operates in \nmore than 100 countries.",
    "isRecorded": true
  },
  {
    "time": "03:00",
    "seconds": 180,
    "speaker": "CNBC Reporter",
    "text": "It provides security \nservices to a wide range of businesses, including data \ncenters, airports, the New York \nTheater District and public",
    "isRecorded": true
  },
  {
    "time": "03:08",
    "seconds": 188,
    "speaker": "CNBC Reporter",
    "text": "transportation such as the \nStaten Island Ferry Terminal.",
    "isRecorded": true
  },
  {
    "time": "03:11",
    "seconds": 191,
    "speaker": "CNBC Reporter",
    "text": "When the Guardian has a \nclient, they need something a little \nbit more aggressive. Maybe it's a visual deterrent.",
    "isRecorded": true
  },
  {
    "time": "03:16",
    "seconds": 196,
    "speaker": "CNBC Reporter",
    "text": "Maybe they want an armed \npresence. Maybe they want an off duty officer. That's \nwhere we fit in. Alongside the two of us, \nallied has the technology",
    "isRecorded": true
  },
  {
    "time": "03:23",
    "seconds": 203,
    "speaker": "CNBC Reporter",
    "text": "services business: \nsurveillance cameras, drone detection, \ncounter drone detection.",
    "isRecorded": true
  },
  {
    "time": "03:28",
    "seconds": 208,
    "speaker": "CNBC Reporter",
    "text": "So they are the technology \npiece.",
    "isRecorded": true
  },
  {
    "time": "03:32",
    "seconds": 212,
    "speaker": "CNBC Reporter",
    "text": "Allied universal has grown \nto the third largest private employer in North America, \nwith a reported annual revenue of $16 billion in \nthe region.",
    "isRecorded": true
  },
  {
    "time": "03:41",
    "seconds": 221,
    "speaker": "CNBC Reporter",
    "text": "Its canine program is one \nspecialized part of a much larger security operation, \nwhich also includes guard services, executive \nprotection and technology",
    "isRecorded": true
  },
  {
    "time": "03:51",
    "seconds": 231,
    "speaker": "CNBC Reporter",
    "text": "enabled surveillance.",
    "isRecorded": true
  },
  {
    "time": "03:53",
    "seconds": 233,
    "speaker": "CNBC Reporter",
    "text": "To see how those \ncapabilities are deployed in the field, I went to the \nStaten Island Ferry in New York City. Allied Universal \ngave us a controlled",
    "isRecorded": true
  },
  {
    "time": "04:00",
    "seconds": 240,
    "speaker": "CNBC Reporter",
    "text": "demonstration of how one of \nits K-9 teams screens a bag.",
    "isRecorded": true
  },
  {
    "time": "04:04",
    "seconds": 244,
    "speaker": "CNBC Reporter",
    "text": "Hey good morning. Just need \nto do a bag screening. Seek.",
    "isRecorded": true
  },
  {
    "time": "04:12",
    "seconds": 252,
    "speaker": "CNBC Reporter",
    "text": "Seek. If a dog alerts, \nnow we have to figure out what's in that bag.",
    "isRecorded": true
  },
  {
    "time": "04:16",
    "seconds": 256,
    "speaker": "CNBC Reporter",
    "text": "Then we will bring the NYPD \nin to try to determine what's in that bag.",
    "isRecorded": true
  },
  {
    "time": "04:20",
    "seconds": 260,
    "speaker": "CNBC Reporter",
    "text": "There's cameras all over \nthis facility.",
    "isRecorded": true
  },
  {
    "time": "04:22",
    "seconds": 262,
    "speaker": "CNBC Reporter",
    "text": "It is our employees that are \nmonitoring all those cameras. And then we have a \nlarge guard presence, as you'll see. And they work \nin tandem.",
    "isRecorded": true
  },
  {
    "time": "04:33",
    "seconds": 273,
    "speaker": "CNBC Reporter",
    "text": "Stay. Good girl.",
    "isRecorded": true
  },
  {
    "time": "04:35",
    "seconds": 275,
    "speaker": "CNBC Reporter",
    "text": "I visited Allied Universal's \ncanine training facility in Windsor, Connecticut, \nto see how one part of its much larger security \noperation works.",
    "isRecorded": true
  },
  {
    "time": "04:44",
    "seconds": 284,
    "speaker": "CNBC Reporter",
    "text": "Good girl. This is basically \na really a crawl, walk, run stage because like \nI said, the dog is new to this environment, \nright? So it does go through",
    "isRecorded": true
  },
  {
    "time": "04:50",
    "seconds": 290,
    "speaker": "CNBC Reporter",
    "text": "a bit of acclimation \nprocess.",
    "isRecorded": true
  },
  {
    "time": "04:52",
    "seconds": 292,
    "speaker": "CNBC Reporter",
    "text": "And we really introduce the \nfirst stages of training to them.",
    "isRecorded": true
  },
  {
    "time": "04:57",
    "seconds": 297,
    "speaker": "CNBC Reporter",
    "text": "Seek. Good girl.",
    "isRecorded": true
  },
  {
    "time": "05:01",
    "seconds": 301,
    "speaker": "CNBC Reporter",
    "text": "Overall crime is going down, but you get these high \nprofile kind of incidents and catalysts. What that \nreally did, it kind of transformed the \nlegal definition of",
    "isRecorded": true
  },
  {
    "time": "05:13",
    "seconds": 313,
    "speaker": "CNBC Reporter",
    "text": "commercial foreseeability.",
    "isRecorded": true
  },
  {
    "time": "05:14",
    "seconds": 314,
    "speaker": "CNBC Reporter",
    "text": "With social media and the \nmedia coverage of some of these events that we've had, not only domestically, \nbut globally.",
    "isRecorded": true
  },
  {
    "time": "05:20",
    "seconds": 320,
    "speaker": "CNBC Reporter",
    "text": "That's in people's faces \n24/7 now.",
    "isRecorded": true
  },
  {
    "time": "05:23",
    "seconds": 323,
    "speaker": "CNBC Reporter",
    "text": "And they understand security \nis something that is required.",
    "isRecorded": true
  },
  {
    "time": "05:26",
    "seconds": 326,
    "speaker": "CNBC Reporter",
    "text": "For many companies, \nthat perceived risk becomes urgent once they are \ndirectly affected.",
    "isRecorded": true
  },
  {
    "time": "05:31",
    "seconds": 331,
    "speaker": "CNBC Reporter",
    "text": "Usually they call us up \nafter they have been a victim of a crime and then \nsay, oh, with all the stuff going on, we finally got \nhit. They, like they said,",
    "isRecorded": true
  },
  {
    "time": "05:37",
    "seconds": 337,
    "speaker": "CNBC Reporter",
    "text": "we are part of that story \nthat you read about three weeks ago.",
    "isRecorded": true
  },
  {
    "time": "05:39",
    "seconds": 339,
    "speaker": "CNBC Reporter",
    "text": "But companies can face \npressure even before an attack reaches their own \ndoorstep.",
    "isRecorded": true
  },
  {
    "time": "05:44",
    "seconds": 344,
    "speaker": "CNBC Reporter",
    "text": "You know, incidents that \nhave happened, it is without a doubt foreseeable.",
    "isRecorded": true
  },
  {
    "time": "05:48",
    "seconds": 348,
    "speaker": "CNBC Reporter",
    "text": "And once something is \nforeseeable, that kind of creates a \nstandard of care.",
    "isRecorded": true
  },
  {
    "time": "05:53",
    "seconds": 353,
    "speaker": "CNBC Reporter",
    "text": "There's liability, \nright?",
    "isRecorded": true
  },
  {
    "time": "05:54",
    "seconds": 354,
    "speaker": "CNBC Reporter",
    "text": "There's what it takes to get \nand maintain insurance cover. Part of what's so \nawful about violence is that the costs associated with \nviolence are off the charts.",
    "isRecorded": true
  },
  {
    "time": "06:08",
    "seconds": 368,
    "speaker": "CNBC Reporter",
    "text": "So there are estimates from, you know, the social science \ncommunity that say things like the social cost of a \nhomicide,",
    "isRecorded": true
  },
  {
    "time": "06:19",
    "seconds": 379,
    "speaker": "CNBC Reporter",
    "text": "a single homicide, \nwill be upwards of $15 million.",
    "isRecorded": true
  },
  {
    "time": "06:24",
    "seconds": 384,
    "speaker": "CNBC Reporter",
    "text": "Those types of high profile \nincidents, it raises the kind of duty \nof care of organizations and venues to increase security.",
    "isRecorded": true
  },
  {
    "time": "06:34",
    "seconds": 394,
    "speaker": "CNBC Reporter",
    "text": "And so it's a prerequisite \nin a lot of situations in order to be able to have \ninsurance that kind of drives the market.",
    "isRecorded": true
  },
  {
    "time": "06:48",
    "seconds": 408,
    "speaker": "CNBC Reporter",
    "text": "There's also a labor story \nhere.",
    "isRecorded": true
  },
  {
    "time": "06:50",
    "seconds": 410,
    "speaker": "CNBC Reporter",
    "text": "Federal labor data counted \nalmost 1.3 million security guards in the US as of May \n2025, which is nearly twice the \nnumber of police and",
    "isRecorded": true
  },
  {
    "time": "06:58",
    "seconds": 418,
    "speaker": "CNBC Reporter",
    "text": "sheriff's patrol officers.",
    "isRecorded": true
  },
  {
    "time": "07:00",
    "seconds": 420,
    "speaker": "CNBC Reporter",
    "text": "The number of security \nguards has surged more than 16% between 2016 and 2025.",
    "isRecorded": true
  },
  {
    "time": "07:05",
    "seconds": 425,
    "speaker": "CNBC Reporter",
    "text": "For comparison, \nthe national police force has expanded by around 2% \nover the same period.",
    "isRecorded": true
  },
  {
    "time": "07:11",
    "seconds": 431,
    "speaker": "CNBC Reporter",
    "text": "They are acting as a force \nmultiplier, I think, for public safety \norganizations.",
    "isRecorded": true
  },
  {
    "time": "07:17",
    "seconds": 437,
    "speaker": "CNBC Reporter",
    "text": "They are acting as really \neyes and ears on the ground.",
    "isRecorded": true
  },
  {
    "time": "07:21",
    "seconds": 441,
    "speaker": "CNBC Reporter",
    "text": "We like to say that often \nprivate security officers are the \"first\" first \nresponders.",
    "isRecorded": true
  },
  {
    "time": "07:27",
    "seconds": 447,
    "speaker": "CNBC Reporter",
    "text": "But the rise in labor may be \nmisleading.",
    "isRecorded": true
  },
  {
    "time": "07:29",
    "seconds": 449,
    "speaker": "CNBC Reporter",
    "text": "The total security guard \nworkforce is expected to stay roughly flat through \n2034, according to a July 2026 \nreport.",
    "isRecorded": true
  },
  {
    "time": "07:36",
    "seconds": 456,
    "speaker": "CNBC Reporter",
    "text": "The report also noted that \nemployers are likely to keep hiring due to high turnover.",
    "isRecorded": true
  },
  {
    "time": "07:41",
    "seconds": 461,
    "speaker": "CNBC Reporter",
    "text": "Annual churn in 2024 hit 89% \nfor security guards, above the 66% average seen \nacross private payrolls.",
    "isRecorded": true
  },
  {
    "time": "07:49",
    "seconds": 469,
    "speaker": "CNBC Reporter",
    "text": "The report also found that \nthe median salary for a security officer in the US \nis $18.70 an hour, or $36,282 a year.",
    "isRecorded": true
  },
  {
    "time": "08:00",
    "seconds": 480,
    "speaker": "CNBC Reporter",
    "text": "The workforce is really the \nfirst respondents because they're already on the scene \nwhen an event occurs.",
    "isRecorded": true
  },
  {
    "time": "08:05",
    "seconds": 485,
    "speaker": "CNBC Reporter",
    "text": "Yet the pay, training and \nother labor standards of the job have not kept up with \nthose responsibilities and riskiness of the job.",
    "isRecorded": true
  },
  {
    "time": "08:14",
    "seconds": 494,
    "speaker": "CNBC Reporter",
    "text": "This contributes to the high \nturnover that we're seeing in the industry, \nwhich means there's less and less experienced workers \nhaving to do more risky",
    "isRecorded": true
  },
  {
    "time": "08:26",
    "seconds": 506,
    "speaker": "CNBC Reporter",
    "text": "responsibilities in a job \nthat is meant to protect the public.",
    "isRecorded": true
  },
  {
    "time": "08:32",
    "seconds": 512,
    "speaker": "CNBC Reporter",
    "text": "Allied Universal said its \nNorth American workforce turnover is about half the \nindustry average.",
    "isRecorded": true
  },
  {
    "time": "08:37",
    "seconds": 517,
    "speaker": "CNBC Reporter",
    "text": "The company told CNBC it \nprovides employees with onboarding, ongoing \neducation and specialized training, and that pay \nvaries by market assignment",
    "isRecorded": true
  },
  {
    "time": "08:46",
    "seconds": 526,
    "speaker": "CNBC Reporter",
    "text": "skills and union agreements.",
    "isRecorded": true
  },
  {
    "time": "08:49",
    "seconds": 529,
    "speaker": "CNBC Reporter",
    "text": "About 20% of its North \nAmerican employees are union represented. Allied \nUniversal says its investments in the workforce \nalso includes AI analytics",
    "isRecorded": true
  },
  {
    "time": "08:58",
    "seconds": 538,
    "speaker": "CNBC Reporter",
    "text": "and remote monitoring \ndesigned to make security professionals more \neffective.",
    "isRecorded": true
  },
  {
    "time": "09:02",
    "seconds": 542,
    "speaker": "CNBC Reporter",
    "text": "But as those tools take on a \nlarger role, the industry faces a broader \nquestion around what AI technology can handle and \nwhat still requires a",
    "isRecorded": true
  },
  {
    "time": "09:10",
    "seconds": 550,
    "speaker": "CNBC Reporter",
    "text": "person on site.",
    "isRecorded": true
  },
  {
    "time": "09:12",
    "seconds": 552,
    "speaker": "CNBC Reporter",
    "text": "The idea that AI is going to \nreplace security officers just doesn't make sense.",
    "isRecorded": true
  },
  {
    "time": "09:18",
    "seconds": 558,
    "speaker": "CNBC Reporter",
    "text": "The fundamental premise in \nhaving security is dealing with incidents that are \ncaused by people.",
    "isRecorded": true
  },
  {
    "time": "09:25",
    "seconds": 565,
    "speaker": "CNBC Reporter",
    "text": "That's not going to cut it.",
    "isRecorded": true
  },
  {
    "time": "09:26",
    "seconds": 566,
    "speaker": "CNBC Reporter",
    "text": "And AI is not going to be \nable to take the place of a security officer who's who's \ntrained in de-escalation, who's trained about \nevacuation,",
    "isRecorded": true
  },
  {
    "time": "09:35",
    "seconds": 575,
    "speaker": "CNBC Reporter",
    "text": "and what is necessary to \nbest protect the employees and customers at a site.",
    "isRecorded": true
  },
  {
    "time": "09:40",
    "seconds": 580,
    "speaker": "CNBC Reporter",
    "text": "Obviously, you're always \ngoing to need the human element. This is a human \ndriven business.",
    "isRecorded": true
  }
],
  "nOt6TyyfLGU": [
  {
    "time": "00:01",
    "seconds": 1,
    "speaker": "CNBC Reporter",
    "text": "So we were up in the field \nand we were picking.",
    "isRecorded": true
  },
  {
    "time": "00:05",
    "seconds": 5,
    "speaker": "CNBC Reporter",
    "text": "It was just kind of bizarre \nthat all of a sudden we just kept hearing a plane and \nwe're like, there's something about \nthat. They're going over the",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "CNBC Reporter",
    "text": "property just way too much.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "CNBC Reporter",
    "text": "And sure enough, \nit did happen.",
    "isRecorded": true
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "CNBC Reporter",
    "text": "They called and they said, \nwe're interested in your property.",
    "isRecorded": true
  },
  {
    "time": "00:19",
    "seconds": 19,
    "speaker": "CNBC Reporter",
    "text": "Nice to meet you. It's nice \nto meet you.",
    "isRecorded": true
  },
  {
    "time": "00:21",
    "seconds": 21,
    "speaker": "CNBC Reporter",
    "text": "Bobbi Thompson and Michelle \nKennedy are sisters who live here in Lancaster, \nPennsylvania.",
    "isRecorded": true
  },
  {
    "time": "00:27",
    "seconds": 27,
    "speaker": "CNBC Reporter",
    "text": "They say they've had \nmultiple offers to purchase their farm from land \nprospectors who are looking to capitalize on the AI \nboom.",
    "isRecorded": true
  },
  {
    "time": "00:34",
    "seconds": 34,
    "speaker": "CNBC Reporter",
    "text": "Lancaster County, \nPennsylvania, is attracting companies like \nCoreWeave because of its reliable electrical grid, \nstate-level incentives and",
    "isRecorded": true
  },
  {
    "time": "00:42",
    "seconds": 42,
    "speaker": "CNBC Reporter",
    "text": "prime Mid-Atlantic location \nthat's close to multiple large cities. But the AI \nbuildout is impacting communities across the \ncountry and sparking a",
    "isRecorded": true
  },
  {
    "time": "00:49",
    "seconds": 49,
    "speaker": "CNBC Reporter",
    "text": "national confrontation \nbetween technology companies and their investors, \non the one hand, and residents on the other.",
    "isRecorded": true
  },
  {
    "time": "00:56",
    "seconds": 56,
    "speaker": "CNBC Reporter",
    "text": "There are over 4,700 data \ncenters in the U.S., and that number is climbing \nrapidly.",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "CNBC Reporter",
    "text": "It's a similar story in \nBoise, Idaho, where demand for \nspace has skyrocketed since Micron and Meta announced \nmajor new projects there.",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "CNBC Reporter",
    "text": "The growth has been \ntremendous here.",
    "isRecorded": true
  },
  {
    "time": "01:11",
    "seconds": 71,
    "speaker": "CNBC Reporter",
    "text": "Mike Adler is the founder \nand CEO of Adler Industrial, the largest industrial \nproperty developer in the Boise area. The company \ncontrols a thousand acres",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "CNBC Reporter",
    "text": "and $1 billion worth of real \nestate across Idaho.",
    "isRecorded": true
  },
  {
    "time": "01:22",
    "seconds": 82,
    "speaker": "CNBC Reporter",
    "text": "We started in this market \nwith about 1.9 million ft², and we've grown that to 4.6 \nmillion ft².",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "CNBC Reporter",
    "text": "Amazon, Alphabet, \nMicrosoft and Meta's combined capital expenditure \nwas over $167 billion in the second quarter of 2026, \nup 79% year-over-year as the",
    "isRecorded": true
  },
  {
    "time": "01:40",
    "seconds": 100,
    "speaker": "CNBC Reporter",
    "text": "Tech giants poured billions \ninto the AI buildout.",
    "isRecorded": true
  },
  {
    "time": "01:43",
    "seconds": 103,
    "speaker": "CNBC Reporter",
    "text": "Semiconductor manufacturer \nMicron plans to invest $250 billion in the U.S.",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "CNBC Reporter",
    "text": "through 2035 as the AI boom \nincreases demand for memory.",
    "isRecorded": true
  },
  {
    "time": "01:53",
    "seconds": 113,
    "speaker": "CNBC Reporter",
    "text": "The AI expansion is fueling \na new kind of land rush.",
    "isRecorded": true
  },
  {
    "time": "01:56",
    "seconds": 116,
    "speaker": "CNBC Reporter",
    "text": "CNBC traveled to \nPennsylvania and Idaho to see why land prospectors are \nracing in to buy up rural farmland in communities \nacross the nation.",
    "isRecorded": true
  },
  {
    "time": "02:12",
    "seconds": 132,
    "speaker": "CNBC Reporter",
    "text": "That's the original owners \nPap and Nonna of the farm.",
    "isRecorded": true
  },
  {
    "time": "02:16",
    "seconds": 136,
    "speaker": "CNBC Reporter",
    "text": "They were our mother's \nparents.",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "CNBC Reporter",
    "text": "Michelle Kennedy and Bobbi \nThompson's family has lived on their farm in Lancaster \nCounty, Pennsylvania for decades.",
    "isRecorded": true
  },
  {
    "time": "02:23",
    "seconds": 143,
    "speaker": "CNBC Reporter",
    "text": "But lately they're seeing a \nlot of change.",
    "isRecorded": true
  },
  {
    "time": "02:26",
    "seconds": 146,
    "speaker": "CNBC Reporter",
    "text": "Explosion. Housing.",
    "isRecorded": true
  },
  {
    "time": "02:28",
    "seconds": 148,
    "speaker": "CNBC Reporter",
    "text": "People moving in.",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "CNBC Reporter",
    "text": "Warehouses. So the small \ntown of Mount Joy isn't what it once was.",
    "isRecorded": true
  },
  {
    "time": "02:35",
    "seconds": 155,
    "speaker": "CNBC Reporter",
    "text": "CoreWeave is building a data \ncenter less than 20 miles from their home. The company \nis investing $6 billion in the project. As AI \ninfrastructure expands in",
    "isRecorded": true
  },
  {
    "time": "02:43",
    "seconds": 163,
    "speaker": "CNBC Reporter",
    "text": "their region, \nKennedy and Thompson have received repeated offers to \nsell their farm.",
    "isRecorded": true
  },
  {
    "time": "02:47",
    "seconds": 167,
    "speaker": "CNBC Reporter",
    "text": "How many offers would you \nsay you've gotten in the past year?",
    "isRecorded": true
  },
  {
    "time": "02:50",
    "seconds": 170,
    "speaker": "CNBC Reporter",
    "text": "I think within this last \nyear, between her and I, \nwe probably had over 50 until we actually had to \njust tell them to stop.",
    "isRecorded": true
  },
  {
    "time": "02:58",
    "seconds": 178,
    "speaker": "CNBC Reporter",
    "text": "The sisters put an easement \non their property to protect it from industrial \ndevelopment, but they can't stop the \nchange that's happening all around them.",
    "isRecorded": true
  },
  {
    "time": "03:05",
    "seconds": 185,
    "speaker": "CNBC Reporter",
    "text": "It's designed to lock the \nland so it can only be used for farming, so it's \npreserving it.",
    "isRecorded": true
  },
  {
    "time": "03:11",
    "seconds": 191,
    "speaker": "CNBC Reporter",
    "text": "Will that give you peace of \nmind?",
    "isRecorded": true
  },
  {
    "time": "03:13",
    "seconds": 193,
    "speaker": "CNBC Reporter",
    "text": "For our own property.",
    "isRecorded": true
  },
  {
    "time": "03:14",
    "seconds": 194,
    "speaker": "CNBC Reporter",
    "text": "For our own property, \nyou know, yeah.",
    "isRecorded": true
  },
  {
    "time": "03:15",
    "seconds": 195,
    "speaker": "CNBC Reporter",
    "text": "We just can't control what \nhappens around us.",
    "isRecorded": true
  },
  {
    "time": "03:17",
    "seconds": 197,
    "speaker": "CNBC Reporter",
    "text": "Their neighbors have applied \nto rezone their property and build an industrial park \nwith multiple buildings, internal roadways and \nfacilities to accommodate",
    "isRecorded": true
  },
  {
    "time": "03:24",
    "seconds": 204,
    "speaker": "CNBC Reporter",
    "text": "hundreds of employees.",
    "isRecorded": true
  },
  {
    "time": "03:27",
    "seconds": 207,
    "speaker": "CNBC Reporter",
    "text": "Bella.",
    "isRecorded": true
  },
  {
    "time": "03:28",
    "seconds": 208,
    "speaker": "CNBC Reporter",
    "text": "Can you imagine if you had, \nyou know, a thousand vehicles parked \n24/7?",
    "isRecorded": true
  },
  {
    "time": "03:32",
    "seconds": 212,
    "speaker": "CNBC Reporter",
    "text": "They're not going to be \ncomfortable. Cows don't produce milk if they're not \nin their relaxed and laid down. Come on little girls.",
    "isRecorded": true
  },
  {
    "time": "03:39",
    "seconds": 219,
    "speaker": "CNBC Reporter",
    "text": "Let's go ladies.",
    "isRecorded": true
  },
  {
    "time": "03:40",
    "seconds": 220,
    "speaker": "CNBC Reporter",
    "text": "What do you think this area \nwill look like in 5 to 10 years?",
    "isRecorded": true
  },
  {
    "time": "03:44",
    "seconds": 224,
    "speaker": "CNBC Reporter",
    "text": "My goodness, it's changed so \nmuch already in five years.",
    "isRecorded": true
  },
  {
    "time": "03:47",
    "seconds": 227,
    "speaker": "CNBC Reporter",
    "text": "I'm almost frightened to \nthink about it. I mean, it's- It's not going to be little \nMount Joy anymore.",
    "isRecorded": true
  },
  {
    "time": "03:52",
    "seconds": 232,
    "speaker": "CNBC Reporter",
    "text": "I mean, it isn't already.",
    "isRecorded": true
  },
  {
    "time": "04:00",
    "seconds": 240,
    "speaker": "CNBC Reporter",
    "text": "Behind me is one of two \nmassive semiconductor fabrication plants that \nMicron is building in the Boise area, and about 10 to \n15 miles that way Meta is",
    "isRecorded": true
  },
  {
    "time": "04:10",
    "seconds": 250,
    "speaker": "CNBC Reporter",
    "text": "building an enormous data \ncenter.",
    "isRecorded": true
  },
  {
    "time": "04:12",
    "seconds": 252,
    "speaker": "CNBC Reporter",
    "text": "These projects are pumping \nin tens of billions of dollars into the Boise area \neconomy and they're pulling in an army of contractors.",
    "isRecorded": true
  },
  {
    "time": "04:21",
    "seconds": 261,
    "speaker": "CNBC Reporter",
    "text": "The projects are drawing in \ncompanies needed to power, cool and construct them, all \nof whom need their own space.",
    "isRecorded": true
  },
  {
    "time": "04:27",
    "seconds": 267,
    "speaker": "CNBC Reporter",
    "text": "There was a lot of land \nthat, to me, felt like it was in \nthe middle of nowhere, and it wasn't really \ndevelopable.",
    "isRecorded": true
  },
  {
    "time": "04:33",
    "seconds": 273,
    "speaker": "CNBC Reporter",
    "text": "In 2018, Mike Adler acquired \nan alfalfa farm in the Boise area. Then he got a call \nfrom FedEx.",
    "isRecorded": true
  },
  {
    "time": "04:39",
    "seconds": 279,
    "speaker": "CNBC Reporter",
    "text": "They wanted to build on the \nland.",
    "isRecorded": true
  },
  {
    "time": "04:41",
    "seconds": 281,
    "speaker": "CNBC Reporter",
    "text": "A year and a half later, \nhe got a call from Amazon, and then another call from \nTesla.",
    "isRecorded": true
  },
  {
    "time": "04:45",
    "seconds": 285,
    "speaker": "CNBC Reporter",
    "text": "So all of a sudden, \nour property that I felt like it was in the middle of \nnowhere, I have three highly credit \ntenants.",
    "isRecorded": true
  },
  {
    "time": "04:53",
    "seconds": 293,
    "speaker": "CNBC Reporter",
    "text": "Adler is betting that the \nprojects from Micron and Meta will continue to draw \nin businesses.",
    "isRecorded": true
  },
  {
    "time": "04:57",
    "seconds": 297,
    "speaker": "CNBC Reporter",
    "text": "62% of his company's current \nprojects in the Boise Valley area are being built on \nspec, meaning that buildings are \nconstructed before the",
    "isRecorded": true
  },
  {
    "time": "05:05",
    "seconds": 305,
    "speaker": "CNBC Reporter",
    "text": "tenant has even been \nsecured.",
    "isRecorded": true
  },
  {
    "time": "05:07",
    "seconds": 307,
    "speaker": "CNBC Reporter",
    "text": "What's it like building on \nspec?",
    "isRecorded": true
  },
  {
    "time": "05:08",
    "seconds": 308,
    "speaker": "CNBC Reporter",
    "text": "Is that, it sounds a little \nrisky.",
    "isRecorded": true
  },
  {
    "time": "05:11",
    "seconds": 311,
    "speaker": "CNBC Reporter",
    "text": "Spec is being done when we \nare out of space to lease to our existing customers, \nand we believe that there's other businesses in the \nmarket that need more space.",
    "isRecorded": true
  },
  {
    "time": "05:21",
    "seconds": 321,
    "speaker": "CNBC Reporter",
    "text": "And that's what you're \nseeing now.",
    "isRecorded": true
  },
  {
    "time": "05:22",
    "seconds": 322,
    "speaker": "CNBC Reporter",
    "text": "Yes. This is a 26,000 ft² \nspace within an 88,000 ft² building that we just \ncompleted in the Boise Airport area. We just leased \nit to a company that does",
    "isRecorded": true
  },
  {
    "time": "05:35",
    "seconds": 335,
    "speaker": "CNBC Reporter",
    "text": "warehousing, fulfillment and \ndistribution for the construction industry.",
    "isRecorded": true
  },
  {
    "time": "05:40",
    "seconds": 340,
    "speaker": "CNBC Reporter",
    "text": "But anticipating demand \ncomes with risks.",
    "isRecorded": true
  },
  {
    "time": "05:43",
    "seconds": 343,
    "speaker": "CNBC Reporter",
    "text": "Memory stocks like Micron \nhistorically cycle through boom and bust periods, \nwhich pose a risk to investors and businesses \nbetting big on",
    "isRecorded": true
  },
  {
    "time": "05:50",
    "seconds": 350,
    "speaker": "CNBC Reporter",
    "text": "the AI build out.",
    "isRecorded": true
  },
  {
    "time": "05:51",
    "seconds": 351,
    "speaker": "CNBC Reporter",
    "text": "Sometimes supply gets beyond \ndemand, and at that point, \nthat's when we don't build more. We let those buildings \nlease up.",
    "isRecorded": true
  },
  {
    "time": "05:59",
    "seconds": 359,
    "speaker": "CNBC Reporter",
    "text": "And then once they're \nleased, then we reexamine the market \nto determine if it makes sense to build more.",
    "isRecorded": true
  },
  {
    "time": "06:05",
    "seconds": 365,
    "speaker": "CNBC Reporter",
    "text": "This specific filter was \nmade for a hyperscale data center.",
    "isRecorded": true
  },
  {
    "time": "06:09",
    "seconds": 369,
    "speaker": "CNBC Reporter",
    "text": "One of the businesses \nrenting warehouse space from Mike Adler is Air Filter \nSuperstore here in the Boise area. That's led by Phil \nDugan,",
    "isRecorded": true
  },
  {
    "time": "06:17",
    "seconds": 377,
    "speaker": "CNBC Reporter",
    "text": "who has seen demand for his \nproducts increase as the AI boom in the area has \ncontinued.",
    "isRecorded": true
  },
  {
    "time": "06:23",
    "seconds": 383,
    "speaker": "CNBC Reporter",
    "text": "Pre 2020, when Covid became \na thing, we were under $10 million in \nrevenue a year.",
    "isRecorded": true
  },
  {
    "time": "06:28",
    "seconds": 388,
    "speaker": "CNBC Reporter",
    "text": "Now that we have grown with \nthe AI boom and all the other infrastructure and all \nother sectors growing, we have more than tripled \nthat.",
    "isRecorded": true
  },
  {
    "time": "06:35",
    "seconds": 395,
    "speaker": "CNBC Reporter",
    "text": "Just over the past couple of \nyears, he's gone from renting \n7,000ft² of warehouse space to more than 30,000ft².",
    "isRecorded": true
  },
  {
    "time": "06:42",
    "seconds": 402,
    "speaker": "CNBC Reporter",
    "text": "The company invested about \n$1 million in that expansion, and now they're \npreparing to grow even more.",
    "isRecorded": true
  },
  {
    "time": "06:47",
    "seconds": 407,
    "speaker": "CNBC Reporter",
    "text": "The next 3 to 5 years, \nwe definitely foresee us doubling in size, \nat least.",
    "isRecorded": true
  },
  {
    "time": "06:52",
    "seconds": 412,
    "speaker": "CNBC Reporter",
    "text": "I was born and raised here, \nand this is something that I never expected to happen.",
    "isRecorded": true
  },
  {
    "time": "06:55",
    "seconds": 415,
    "speaker": "CNBC Reporter",
    "text": "But real estate prices in \nthe area are skyrocketing.",
    "isRecorded": true
  },
  {
    "time": "06:58",
    "seconds": 418,
    "speaker": "CNBC Reporter",
    "text": "It's a lot more difficult to \nget space in town than it has been. The spaces now \nthat we've been looking at in other locations to expand \nhave definitely",
    "isRecorded": true
  },
  {
    "time": "07:08",
    "seconds": 428,
    "speaker": "CNBC Reporter",
    "text": "substantially almost doubled \nwhat we've seen in most cases over the last three \nyears.",
    "isRecorded": true
  },
  {
    "time": "07:13",
    "seconds": 433,
    "speaker": "CNBC Reporter",
    "text": "I do have some concerns that \ngrowth is becoming too fast.",
    "isRecorded": true
  },
  {
    "time": "07:18",
    "seconds": 438,
    "speaker": "CNBC Reporter",
    "text": "To see this scale of \ndevelopment, and especially in the time \nperiod this has happened, it's a little unprecedented.",
    "isRecorded": true
  },
  {
    "time": "07:26",
    "seconds": 446,
    "speaker": "CNBC Reporter",
    "text": "Harry Sawyer works for a \ncommercial real estate firm in the Boise area. He says \nhe's seen property values reach up to 15 times what \nthey were before Covid.",
    "isRecorded": true
  },
  {
    "time": "07:34",
    "seconds": 454,
    "speaker": "CNBC Reporter",
    "text": "These farms have been in the \nfamily for generations.",
    "isRecorded": true
  },
  {
    "time": "07:37",
    "seconds": 457,
    "speaker": "CNBC Reporter",
    "text": "I expect over the next five \nyears, seven years, a lot of this \nland that we're seeing right here will be developed into \nindustrial.",
    "isRecorded": true
  },
  {
    "time": "07:47",
    "seconds": 467,
    "speaker": "CNBC Reporter",
    "text": "The land Mike Adler is \ndeveloping is part of a much bigger national land rush.",
    "isRecorded": true
  },
  {
    "time": "07:52",
    "seconds": 472,
    "speaker": "CNBC Reporter",
    "text": "In the first half of 2026, \ninvestors spent nearly $6 billion buying land in the \nU.S.",
    "isRecorded": true
  },
  {
    "time": "07:56",
    "seconds": 476,
    "speaker": "CNBC Reporter",
    "text": "that had been earmarked for \nfuture data centers.",
    "isRecorded": true
  },
  {
    "time": "07:59",
    "seconds": 479,
    "speaker": "CNBC Reporter",
    "text": "That's up 79% from a year \nearlier.",
    "isRecorded": true
  },
  {
    "time": "08:01",
    "seconds": 481,
    "speaker": "CNBC Reporter",
    "text": "Data center land deals made \nup roughly 27% of all spending on development \nsites in that period.",
    "isRecorded": true
  },
  {
    "time": "08:06",
    "seconds": 486,
    "speaker": "CNBC Reporter",
    "text": "The real demand is for the \nland that you could actually build on.",
    "isRecorded": true
  },
  {
    "time": "08:12",
    "seconds": 492,
    "speaker": "CNBC Reporter",
    "text": "For data center developers, \nthe most valuable property is land with access to huge \namounts of electricity.",
    "isRecorded": true
  },
  {
    "time": "08:18",
    "seconds": 498,
    "speaker": "CNBC Reporter",
    "text": "So-called powered land is \nbeing sold at a premium.",
    "isRecorded": true
  },
  {
    "time": "08:21",
    "seconds": 501,
    "speaker": "CNBC Reporter",
    "text": "In Northern Virginia and the \nnortheast, data center sites have exceeded $8 million an \nacre.",
    "isRecorded": true
  },
  {
    "time": "08:25",
    "seconds": 505,
    "speaker": "CNBC Reporter",
    "text": "An estimated 40,000 acres of \npowered land is needed worldwide to accommodate \nanticipated data center growth through 2030.",
    "isRecorded": true
  },
  {
    "time": "08:32",
    "seconds": 512,
    "speaker": "CNBC Reporter",
    "text": "But it's not stopping anyone \nwith land thinking that they have found their new gold \nrush.",
    "isRecorded": true
  },
  {
    "time": "08:38",
    "seconds": 518,
    "speaker": "CNBC Reporter",
    "text": "Speculators are sometimes \nbuying up land without knowing if they can get the \npermits and power access to actually build a data center \nthere.",
    "isRecorded": true
  },
  {
    "time": "08:45",
    "seconds": 525,
    "speaker": "CNBC Reporter",
    "text": "The supply that's out there \nis land that first has to be entitled, infrastructure \nbuilt and bringing power, water, internet kind of to \nit.",
    "isRecorded": true
  },
  {
    "time": "08:57",
    "seconds": 537,
    "speaker": "CNBC Reporter",
    "text": "These utilities, \nelectricity, natural gas, there is a huge backlog just \nin the practice of finding out if this particular site \ncan serve what the",
    "isRecorded": true
  },
  {
    "time": "09:08",
    "seconds": 548,
    "speaker": "CNBC Reporter",
    "text": "client wants.",
    "isRecorded": true
  },
  {
    "time": "09:09",
    "seconds": 549,
    "speaker": "CNBC Reporter",
    "text": "If they can't receive the \nzoning and if they can't receive the infrastructure, \nthey're going to have an illiquid asset for a while.",
    "isRecorded": true
  },
  {
    "time": "09:15",
    "seconds": 555,
    "speaker": "CNBC Reporter",
    "text": "In Pennsylvania, \nGovernor Josh Shapiro has said that of the more than \n100 data center proposals in the state, only five have \nthe permits to",
    "isRecorded": true
  },
  {
    "time": "09:22",
    "seconds": 562,
    "speaker": "CNBC Reporter",
    "text": "actually begin operating.",
    "isRecorded": true
  },
  {
    "time": "09:24",
    "seconds": 564,
    "speaker": "CNBC Reporter",
    "text": "We have seen an unacceptable \nnumber of speculative proposals for data center \ndevelopment that is swamping our Commonwealth.",
    "isRecorded": true
  },
  {
    "time": "09:34",
    "seconds": 574,
    "speaker": "CNBC Reporter",
    "text": "Many of them led by \ndevelopers who have no regard for local \ncommunities.",
    "isRecorded": true
  },
  {
    "time": "09:40",
    "seconds": 580,
    "speaker": "CNBC Reporter",
    "text": "In August, Shapiro signed an \nexecutive order designed to prevent data centers' \nelectric costs from being passed down onto residents, \nto limit water use and",
    "isRecorded": true
  },
  {
    "time": "09:48",
    "seconds": 588,
    "speaker": "CNBC Reporter",
    "text": "increase transparency with \nlocal communities.",
    "isRecorded": true
  },
  {
    "time": "09:50",
    "seconds": 590,
    "speaker": "CNBC Reporter",
    "text": "In Texas, Governor Greg \nAbbott has directed state regulators to require data \ncenters to fully fund their electric infrastructure \nneeds and stop passing those",
    "isRecorded": true
  },
  {
    "time": "09:58",
    "seconds": 598,
    "speaker": "CNBC Reporter",
    "text": "costs along to residents.",
    "isRecorded": true
  },
  {
    "time": "10:00",
    "seconds": 600,
    "speaker": "CNBC Reporter",
    "text": "U.S. electricity consumption \nis projected to rise by nearly 2% a year through \n2030, more than twice the rate of \nthe past decade as the data",
    "isRecorded": true
  },
  {
    "time": "10:07",
    "seconds": 607,
    "speaker": "CNBC Reporter",
    "text": "center buildout continues.",
    "isRecorded": true
  },
  {
    "time": "10:08",
    "seconds": 608,
    "speaker": "CNBC Reporter",
    "text": "A shortage of available \nnear-term power is limiting how quickly some land can be \ndeveloped.",
    "isRecorded": true
  },
  {
    "time": "10:13",
    "seconds": 613,
    "speaker": "CNBC Reporter",
    "text": "It could take a year to \nreally figure out how electricity is going to be \ndistributed onto this site.",
    "isRecorded": true
  },
  {
    "time": "10:20",
    "seconds": 620,
    "speaker": "CNBC Reporter",
    "text": "The cost of new \ninfrastructure is in the millions and ultimately \nbillions because you're affecting the grids.",
    "isRecorded": true
  },
  {
    "time": "10:26",
    "seconds": 626,
    "speaker": "CNBC Reporter",
    "text": "Households are at least \nsubsidizing or sharing in the cost of the upgrades of \ninfrastructure.",
    "isRecorded": true
  },
  {
    "time": "10:34",
    "seconds": 634,
    "speaker": "CNBC Reporter",
    "text": "So this is real. I think \nthere will continue to be pushback.",
    "isRecorded": true
  },
  {
    "time": "10:38",
    "seconds": 638,
    "speaker": "CNBC Reporter",
    "text": "As state and federal \nofficials debate over AI regulations, land investors \nand owners are grappling over decisions that will \ntransform their communities.",
    "isRecorded": true
  },
  {
    "time": "10:47",
    "seconds": 647,
    "speaker": "CNBC Reporter",
    "text": "It's a farm. It'll stay a \nfarm.",
    "isRecorded": true
  },
  {
    "time": "10:49",
    "seconds": 649,
    "speaker": "CNBC Reporter",
    "text": "And even if our children \ndon't want it, it'll still be a farm.",
    "isRecorded": true
  }
],
  "_E25hd641Tg": [
  {
    "time": "00:01",
    "seconds": 1,
    "speaker": "CNBC Reporter",
    "text": "Want to know how strong \ndemand is for the newest version of Toyota's Rav4.",
    "isRecorded": true
  },
  {
    "time": "00:06",
    "seconds": 6,
    "speaker": "CNBC Reporter",
    "text": "Consider Nancy and Ira \nBerman of Danbury, Connecticut.",
    "isRecorded": true
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "CNBC Reporter",
    "text": "It's a new grill.",
    "isRecorded": true
  },
  {
    "time": "00:11",
    "seconds": 11,
    "speaker": "CNBC Reporter",
    "text": "Oh that's right. It's got \nthe new grill on there.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "CNBC Reporter",
    "text": "They ordered their new Rav4 \nin March, and six months later they \nare still waiting to take delivery.",
    "isRecorded": true
  },
  {
    "time": "00:22",
    "seconds": 22,
    "speaker": "CNBC Reporter",
    "text": "The wait was a slight \nannoyance.",
    "isRecorded": true
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "CNBC Reporter",
    "text": "It didn't stop us from going \nand doing because we do have our other Toyotas to drive.",
    "isRecorded": true
  },
  {
    "time": "00:34",
    "seconds": 34,
    "speaker": "CNBC Reporter",
    "text": "It was worth the wait.",
    "isRecorded": true
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "CNBC Reporter",
    "text": "It was worth the wait.",
    "isRecorded": true
  },
  {
    "time": "00:37",
    "seconds": 37,
    "speaker": "CNBC Reporter",
    "text": "Even though Toyota is \ngradually ramping Rav4 production, demand for the \nnew model is so strong, dealers have only a few days \nsupply in stock.",
    "isRecorded": true
  },
  {
    "time": "00:46",
    "seconds": 46,
    "speaker": "CNBC Reporter",
    "text": "In fact, most are turned \nover to customers who ordered them as soon as \nthey're delivered to a dealership.",
    "isRecorded": true
  },
  {
    "time": "00:53",
    "seconds": 53,
    "speaker": "CNBC Reporter",
    "text": "It's really unusual to see \ncars fly off the dealer's lot like this. I mean, \nin fact, most dealers are just \ncalling their customer list",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "CNBC Reporter",
    "text": "saying, hey, can you pick up \nthe car now? It's ready for you. We don't see that very \noften.",
    "isRecorded": true
  },
  {
    "time": "01:02",
    "seconds": 62,
    "speaker": "CNBC Reporter",
    "text": "You see that often with \nspecialty cars that come along, you know, \nonce in a once every ten years. It's not something \nthat exists in that very",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "CNBC Reporter",
    "text": "practical, very suburban, \nuh, small mid-size crossover \nsegment.",
    "isRecorded": true
  },
  {
    "time": "01:25",
    "seconds": 85,
    "speaker": "CNBC Reporter",
    "text": "Two things are driving \nstrong demand for the Rav4 right now. First, \nin recent years, the Rav4's popularity has \nsteadily grown, hitting almost a half \nmillion sold in the U.S.",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "CNBC Reporter",
    "text": "last year.",
    "isRecorded": true
  },
  {
    "time": "01:38",
    "seconds": 98,
    "speaker": "CNBC Reporter",
    "text": "Our dealers are selling \nthrough our inventory as fast as we can build it.",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "CNBC Reporter",
    "text": "This year, we'll build \n200,000 more cars than we did last year. And the \ndealers are still going to sell right through it. They \nend every month with ten day",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "CNBC Reporter",
    "text": "supply of cars and they're \nasking for more.",
    "isRecorded": true
  },
  {
    "time": "01:51",
    "seconds": 111,
    "speaker": "CNBC Reporter",
    "text": "Meanwhile, the spike in gas \nprices due to the war in the Middle East has created even \ngreater demand for hybrid vehicles this year, \nhybrids account for almost",
    "isRecorded": true
  },
  {
    "time": "02:01",
    "seconds": 121,
    "speaker": "CNBC Reporter",
    "text": "one out of every five new \nvehicles sold in the U.S..",
    "isRecorded": true
  },
  {
    "time": "02:05",
    "seconds": 125,
    "speaker": "CNBC Reporter",
    "text": "Add in the fact Toyota has \nlimited Rav4 production while it transitions to the \nnew hybrid version, and you see why this model \nis in the sweet spot of the",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "CNBC Reporter",
    "text": "market right now.",
    "isRecorded": true
  },
  {
    "time": "02:16",
    "seconds": 136,
    "speaker": "CNBC Reporter",
    "text": "Typically, auto dealers like \nto fill every spot in their lot with a new car waiting \nto be sold.",
    "isRecorded": true
  },
  {
    "time": "02:21",
    "seconds": 141,
    "speaker": "CNBC Reporter",
    "text": "But for many Toyota dealers \nlike this one in Milford, Connecticut, the demand for \na new Rav4 is so great and the supply is so limited, \nthey're unable to fill many",
    "isRecorded": true
  },
  {
    "time": "02:31",
    "seconds": 151,
    "speaker": "CNBC Reporter",
    "text": "of these spots.",
    "isRecorded": true
  },
  {
    "time": "02:32",
    "seconds": 152,
    "speaker": "CNBC Reporter",
    "text": "This lot can handle another \ntwo 250 more vehicles, so I'm probably about a \nthird full capacity this summer.",
    "isRecorded": true
  },
  {
    "time": "02:39",
    "seconds": 159,
    "speaker": "CNBC Reporter",
    "text": "Bobby Crabtree's dealership, Colonial Toyota in Milford, \nConnecticut, has seldom had more than a \nhandful of new rav4's on its lot. In fact, \nthe new Rav4 in the showroom",
    "isRecorded": true
  },
  {
    "time": "02:51",
    "seconds": 171,
    "speaker": "CNBC Reporter",
    "text": "has already been sold.",
    "isRecorded": true
  },
  {
    "time": "02:53",
    "seconds": 173,
    "speaker": "CNBC Reporter",
    "text": "It is sold before it's here.",
    "isRecorded": true
  },
  {
    "time": "02:55",
    "seconds": 175,
    "speaker": "CNBC Reporter",
    "text": "You know, when somebody when \nyou have cars that are you know, if you have people out \nthere for two months, three months waiting for the \ncar,",
    "isRecorded": true
  },
  {
    "time": "03:02",
    "seconds": 182,
    "speaker": "CNBC Reporter",
    "text": "that's not only good for us \nas the dealer, but it's actually very good \nfor the customer.",
    "isRecorded": true
  },
  {
    "time": "03:06",
    "seconds": 186,
    "speaker": "CNBC Reporter",
    "text": "While plug in hybrid \nversions of the Rav4 are imported from Japan, \nToyota builds the gas electric hybrid versions at \nplants in Canada and",
    "isRecorded": true
  },
  {
    "time": "03:16",
    "seconds": 196,
    "speaker": "CNBC Reporter",
    "text": "Kentucky. And while the \ncompany is steadily building more models, it won't be at \nfull production until well into 2027. Which raises the \nquestion is Toyota at risk",
    "isRecorded": true
  },
  {
    "time": "03:27",
    "seconds": 207,
    "speaker": "CNBC Reporter",
    "text": "of losing customers who \ndon't want to wait?",
    "isRecorded": true
  },
  {
    "time": "03:30",
    "seconds": 210,
    "speaker": "CNBC Reporter",
    "text": "You're always putting \nyourself at risk when you don't necessarily have that \nproduction that keeps up with demand. Well, \neveryone go to a different",
    "isRecorded": true
  },
  {
    "time": "03:37",
    "seconds": 217,
    "speaker": "CNBC Reporter",
    "text": "brand. Probably not. There's \nother vehicles within the Toyota lineup that consumers \ncan go to.",
    "isRecorded": true
  },
  {
    "time": "03:43",
    "seconds": 223,
    "speaker": "CNBC Reporter",
    "text": "The fact that they're all \nhybrid now, that definitely helps.",
    "isRecorded": true
  },
  {
    "time": "03:46",
    "seconds": 226,
    "speaker": "CNBC Reporter",
    "text": "I think Toyota also has a \nlot of brand loyalty. People that buy a Toyota, \ntechnically, they stay with Toyota for \nfor many years,",
    "isRecorded": true
  },
  {
    "time": "03:52",
    "seconds": 232,
    "speaker": "CNBC Reporter",
    "text": "not just one vehicle \npurchase, but several.",
    "isRecorded": true
  },
  {
    "time": "03:54",
    "seconds": 234,
    "speaker": "CNBC Reporter",
    "text": "But I think there always is \ngoing to be that risk.",
    "isRecorded": true
  },
  {
    "time": "03:56",
    "seconds": 236,
    "speaker": "CNBC Reporter",
    "text": "The Bermans expect to \nreceive their new Rav4 shortly and are eager to \ntake it out on a road trip.",
    "isRecorded": true
  },
  {
    "time": "04:03",
    "seconds": 243,
    "speaker": "CNBC Reporter",
    "text": "We can go cross country if \nwe want to and just enjoy ourselves. And best of all, \nwe're together in the car, driving together.",
    "isRecorded": true
  }
],
  "4Vw4WmNMOxY": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "CNBC Reporter",
    "text": "Meta reached a landmark \nsettlement in its child safety trial with 48 states, plus the District of \nColumbia and multiple territories. The company is \nagreeing to pay up to $17",
    "isRecorded": true
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "CNBC Reporter",
    "text": "billion over ten years over \nits alleged harm to teens in the United States.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "CNBC Reporter",
    "text": "$17 billion is historically \nhigh.",
    "isRecorded": true
  },
  {
    "time": "00:17",
    "seconds": 17,
    "speaker": "CNBC Reporter",
    "text": "It's the highest amount of \nmoney ever paid in a case like this. And $17 billion \ncan do a lot of good to prevent and remediate mental \nhealth harms for kids.",
    "isRecorded": true
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "CNBC Reporter",
    "text": "I want to emphasize the \nimportance of this case is not the money per se, \nit's the change in behavior.",
    "isRecorded": true
  },
  {
    "time": "00:34",
    "seconds": 34,
    "speaker": "CNBC Reporter",
    "text": "Could we have gotten more \nmoney had we pursued to a final verdict at trial?",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "CNBC Reporter",
    "text": "Maybe. But compare what the \nlimits were on Meta's conduct from the New Mexico \ncase, really a lot less than what we got.",
    "isRecorded": true
  },
  {
    "time": "00:45",
    "seconds": 45,
    "speaker": "CNBC Reporter",
    "text": "As part of the settlement, \nMeta must implement safeguards for teens, \nincluding a daily time limit, must block its apps \nat night and pause",
    "isRecorded": true
  },
  {
    "time": "00:53",
    "seconds": 53,
    "speaker": "CNBC Reporter",
    "text": "notifications during school \nhours.",
    "isRecorded": true
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "CNBC Reporter",
    "text": "The product changes that \nthey have agreed to make as part of the settlement are \nquite meaningful. They're attacking and mitigating so \nmany of the features and",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "CNBC Reporter",
    "text": "product design elements that \nhave proven to be harmful to young people.",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "CNBC Reporter",
    "text": "We're digging into how the \nsettlement marks the most significant change to Meta's \nsocial media platforms ever, and how it will pull off \nthese new limits for teens.",
    "isRecorded": true
  },
  {
    "time": "01:30",
    "seconds": 90,
    "speaker": "CNBC Reporter",
    "text": "Meta has agreed to a number \nof changes for its users age 13 to 17, including a two \nhour default time limit blocking its apps between \nmidnight and 6 a.m.,",
    "isRecorded": true
  },
  {
    "time": "01:40",
    "seconds": 100,
    "speaker": "CNBC Reporter",
    "text": "muting notifications during \nschool hours, hiding likes, \ndisabling cosmetic filters, and ensuring it's doing a \nbetter job of figuring out",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "CNBC Reporter",
    "text": "which users are teens and \nwho is under 13 and shouldn't be using its apps.",
    "isRecorded": true
  },
  {
    "time": "01:53",
    "seconds": 113,
    "speaker": "CNBC Reporter",
    "text": "The company says it will \ntake about six months for it to roll out many of the new \ndefault protections that it's agreed to. It already \nhas some of the features,",
    "isRecorded": true
  },
  {
    "time": "02:01",
    "seconds": 121,
    "speaker": "CNBC Reporter",
    "text": "like the ability to mute \nlikes and notifications to give teen users the ability \nto turn off autoplay on videos, and to give them \ncontrol over the algorithms",
    "isRecorded": true
  },
  {
    "time": "02:09",
    "seconds": 129,
    "speaker": "CNBC Reporter",
    "text": "determining their feed, \nMeta needs to build new tools from scratch.",
    "isRecorded": true
  },
  {
    "time": "02:13",
    "seconds": 133,
    "speaker": "CNBC Reporter",
    "text": "I'm particularly interested \nin the provisions that give parents the opportunity to \nopt out of an algorithmic feed, where kids could see a \nchronological feed of",
    "isRecorded": true
  },
  {
    "time": "02:22",
    "seconds": 142,
    "speaker": "CNBC Reporter",
    "text": "content that they have asked \nfor.",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "CNBC Reporter",
    "text": "Their friends, \nthe sports teams they follow, celebrities they're \ninterested in.",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "CNBC Reporter",
    "text": "Because what this does is, \nfor those of us who were using Instagram a decade \nago, eventually you get to a \npoint and it says, you're all caught up. And \nthat's a natural signal to,",
    "isRecorded": true
  },
  {
    "time": "02:38",
    "seconds": 158,
    "speaker": "CNBC Reporter",
    "text": "I don't know, \nput down your phone, pick up a book, go outside.",
    "isRecorded": true
  },
  {
    "time": "02:41",
    "seconds": 161,
    "speaker": "CNBC Reporter",
    "text": "The most complex challenge \nfrom a technical standpoint will be implementing what \nMeta calls \"age assurances,\" stricter age verification \nrequirements to keep",
    "isRecorded": true
  },
  {
    "time": "02:50",
    "seconds": 170,
    "speaker": "CNBC Reporter",
    "text": "children under the age of 13 \noff its platforms, and accurately identifying \nthe 13 to 17 year olds who have lied about their age, \nwhich Meta says will take a",
    "isRecorded": true
  },
  {
    "time": "03:00",
    "seconds": 180,
    "speaker": "CNBC Reporter",
    "text": "year to roll out.",
    "isRecorded": true
  },
  {
    "time": "03:01",
    "seconds": 181,
    "speaker": "CNBC Reporter",
    "text": "Another major condition of \nthe settlement is an independent auditor ensuring \ncompliance.",
    "isRecorded": true
  },
  {
    "time": "03:06",
    "seconds": 186,
    "speaker": "CNBC Reporter",
    "text": "There will be an independent \nconsultant for the data protection order, \nwho is responsible to effectively look at the raw \ndata and make sure that Meta",
    "isRecorded": true
  },
  {
    "time": "03:15",
    "seconds": 195,
    "speaker": "CNBC Reporter",
    "text": "is complying with their end \nof the deal, and issue a annual report \nbased on that and report back to attorneys general if \ntheir compliance measures",
    "isRecorded": true
  },
  {
    "time": "03:26",
    "seconds": 206,
    "speaker": "CNBC Reporter",
    "text": "are inadequate.",
    "isRecorded": true
  },
  {
    "time": "03:28",
    "seconds": 208,
    "speaker": "CNBC Reporter",
    "text": "Part of Meta's settlement is \ntied to TikTok and YouTube getting on board with \nrestrictions for teens.",
    "isRecorded": true
  },
  {
    "time": "03:34",
    "seconds": 214,
    "speaker": "CNBC Reporter",
    "text": "$5.3 billion of Meta's $17 \nbillion settlement is only if TikTok and YouTube agree \nto set default one hour time limits a day on their apps \nfor teen users,",
    "isRecorded": true
  },
  {
    "time": "03:45",
    "seconds": 225,
    "speaker": "CNBC Reporter",
    "text": "and each pay the states $5.3 \nbillion.",
    "isRecorded": true
  },
  {
    "time": "03:49",
    "seconds": 229,
    "speaker": "CNBC Reporter",
    "text": "We're suing TikTok now, \nso we are looking to ensure that they adopt the similar \npractices and commitments that Meta did, \nand we are very interested",
    "isRecorded": true
  },
  {
    "time": "03:57",
    "seconds": 237,
    "speaker": "CNBC Reporter",
    "text": "in Snap and YouTube as well.",
    "isRecorded": true
  },
  {
    "time": "03:59",
    "seconds": 239,
    "speaker": "CNBC Reporter",
    "text": "We want an industry wide \nsolution. We want everyone in the industry to be taking \nsteps like Meta is required to now.",
    "isRecorded": true
  },
  {
    "time": "04:05",
    "seconds": 245,
    "speaker": "CNBC Reporter",
    "text": "And Meta's trying to be a \nleader in this space.",
    "isRecorded": true
  },
  {
    "time": "04:08",
    "seconds": 248,
    "speaker": "CNBC Reporter",
    "text": "Before the landmark \nsettlement, Meta defended its products \nas safe.",
    "isRecorded": true
  },
  {
    "time": "04:12",
    "seconds": 252,
    "speaker": "CNBC Reporter",
    "text": "Now as it implements these \nchanges, it's calling on rivals to \nvoluntarily comply with the new rules that it accepted \nas part of the settlement",
    "isRecorded": true
  },
  {
    "time": "04:19",
    "seconds": 259,
    "speaker": "CNBC Reporter",
    "text": "with state AGs.",
    "isRecorded": true
  },
  {
    "time": "04:21",
    "seconds": 261,
    "speaker": "CNBC Reporter",
    "text": "TikTok and YouTube did not \nrespond to CNBC's request for comment.",
    "isRecorded": true
  },
  {
    "time": "04:25",
    "seconds": 265,
    "speaker": "CNBC Reporter",
    "text": "They're saying, \nprotecting kids is only going to be possible if \neveryone joins us.",
    "isRecorded": true
  },
  {
    "time": "04:30",
    "seconds": 270,
    "speaker": "CNBC Reporter",
    "text": "And I think it's part of \nMeta's playbook to effectively deny wrongdoing.",
    "isRecorded": true
  },
  {
    "time": "04:37",
    "seconds": 277,
    "speaker": "CNBC Reporter",
    "text": "And then when they admit to \nit, usually under a huge amount \nof pressure, trying to kind of come out \nlike a leader in the space.",
    "isRecorded": true
  },
  {
    "time": "04:49",
    "seconds": 289,
    "speaker": "CNBC Reporter",
    "text": "The most complex part of \nMeta's compliance with the settlement is figuring out \nwho to apply these teen restrictions to.",
    "isRecorded": true
  },
  {
    "time": "04:55",
    "seconds": 295,
    "speaker": "CNBC Reporter",
    "text": "Meta has to build an \nentirely new prediction model to identify who's \nunder 13 and which users are 13 to 17 without using \nfacial recognition.",
    "isRecorded": true
  },
  {
    "time": "05:04",
    "seconds": 304,
    "speaker": "CNBC Reporter",
    "text": "The company tells us it'll \nbuild an algorithm that pulls in data like who users \nare connected to, who they follow, \nand who their followers are,",
    "isRecorded": true
  },
  {
    "time": "05:12",
    "seconds": 312,
    "speaker": "CNBC Reporter",
    "text": "as well as details like \nhappy birthday comments.",
    "isRecorded": true
  },
  {
    "time": "05:16",
    "seconds": 316,
    "speaker": "CNBC Reporter",
    "text": "There have been over ten \nyears that they have had no problem identifying who are \nlikely kids in the context of providing value to \nadvertisers.",
    "isRecorded": true
  },
  {
    "time": "05:24",
    "seconds": 324,
    "speaker": "CNBC Reporter",
    "text": "There are so many signals \nthat go into age estimation, and those are the signals \nthat determine which advertising groups people \nare put in for",
    "isRecorded": true
  },
  {
    "time": "05:33",
    "seconds": 333,
    "speaker": "CNBC Reporter",
    "text": "advertising targeting.",
    "isRecorded": true
  },
  {
    "time": "05:35",
    "seconds": 335,
    "speaker": "CNBC Reporter",
    "text": "In a statement to CNBC about \ndetecting underage users, Meta said, quote, \ndeveloping and refining high accuracy AI technology, \nespecially systems designed",
    "isRecorded": true
  },
  {
    "time": "05:44",
    "seconds": 344,
    "speaker": "CNBC Reporter",
    "text": "to protect young people, \nrequires rigorous testing and care. Building \nsophisticated age prediction models is inherently \ncomplex,",
    "isRecorded": true
  },
  {
    "time": "05:52",
    "seconds": 352,
    "speaker": "CNBC Reporter",
    "text": "and suggesting it can be \ndone quickly ignores the technical precision needed \nto ensure these systems are safe and reliable.",
    "isRecorded": true
  },
  {
    "time": "05:59",
    "seconds": 359,
    "speaker": "CNBC Reporter",
    "text": "The challenge of age \nverification has prompted a debate between social media \nplatforms, including Meta and Apple and \nGoogle's app stores.",
    "isRecorded": true
  },
  {
    "time": "06:07",
    "seconds": 367,
    "speaker": "CNBC Reporter",
    "text": "Meta has said the onus \nshould be on the app stores to verify the age of users \nbefore they are able to download an app. Meta has \nalready been working on age",
    "isRecorded": true
  },
  {
    "time": "06:15",
    "seconds": 375,
    "speaker": "CNBC Reporter",
    "text": "gating technology in \ncountries such as Australia, which banned social media \nfor kids under 16 last year.",
    "isRecorded": true
  },
  {
    "time": "06:21",
    "seconds": 381,
    "speaker": "CNBC Reporter",
    "text": "Teens are still finding \nworkarounds to access the apps, such as by using VPNs.",
    "isRecorded": true
  },
  {
    "time": "06:26",
    "seconds": 386,
    "speaker": "CNBC Reporter",
    "text": "I really believe that \nAustralia's minimum age requirement, kind of \nmandatory delay, was a really important first \nstep in keeping kids safe",
    "isRecorded": true
  },
  {
    "time": "06:34",
    "seconds": 394,
    "speaker": "CNBC Reporter",
    "text": "from platforms like Meta.",
    "isRecorded": true
  },
  {
    "time": "06:36",
    "seconds": 396,
    "speaker": "CNBC Reporter",
    "text": "But as we've seen in \nAustralia, the implementation is really \ntricky and important.",
    "isRecorded": true
  },
  {
    "time": "06:45",
    "seconds": 405,
    "speaker": "CNBC Reporter",
    "text": "Not everyone is celebrating \nthe settlement as a win for the states and for teens.",
    "isRecorded": true
  },
  {
    "time": "06:49",
    "seconds": 409,
    "speaker": "CNBC Reporter",
    "text": "The coalition of State AGs \nwere originally looking for as much as $200 billion, \nso this settlement of $17 billion is just a fraction \nof that.",
    "isRecorded": true
  },
  {
    "time": "06:58",
    "seconds": 418,
    "speaker": "CNBC Reporter",
    "text": "That's one reason Florida \ndid not join the 48 states and is moving forward with \nits suit against Meta.",
    "isRecorded": true
  },
  {
    "time": "07:05",
    "seconds": 425,
    "speaker": "CNBC Reporter",
    "text": "This was not a good deal for \nthe States, and that's why Florida \nwasn't a part of it.",
    "isRecorded": true
  },
  {
    "time": "07:09",
    "seconds": 429,
    "speaker": "CNBC Reporter",
    "text": "We are not going to sell out \nwhen it comes to child safety.",
    "isRecorded": true
  },
  {
    "time": "07:12",
    "seconds": 432,
    "speaker": "CNBC Reporter",
    "text": "Plus, Florida's AG cites his \nconcerns with the limited duration of the settlement.",
    "isRecorded": true
  },
  {
    "time": "07:17",
    "seconds": 437,
    "speaker": "CNBC Reporter",
    "text": "Time limit and night mode \nfeatures will start with a five year commitment, \nwith other terms required to remain in place for ten \nyears.",
    "isRecorded": true
  },
  {
    "time": "07:24",
    "seconds": 444,
    "speaker": "CNBC Reporter",
    "text": "The changes can't just be \nfor five years.",
    "isRecorded": true
  },
  {
    "time": "07:26",
    "seconds": 446,
    "speaker": "CNBC Reporter",
    "text": "Child protection is not a \ntemporary short term goal.",
    "isRecorded": true
  },
  {
    "time": "07:30",
    "seconds": 450,
    "speaker": "CNBC Reporter",
    "text": "They violated Florida law \nand our law is not temporary. It's permanent. \nThese changes need to be permanent.",
    "isRecorded": true
  },
  {
    "time": "07:36",
    "seconds": 456,
    "speaker": "CNBC Reporter",
    "text": "As for the question of \nwhether this deal will impact Meta's bottom line, \nthe company has told us that teens generate less than 1% \nof its revenue,",
    "isRecorded": true
  },
  {
    "time": "07:43",
    "seconds": 463,
    "speaker": "CNBC Reporter",
    "text": "but some question whether \nteens will leave for platforms without \nrestrictions, or whether these changes \nwill impact Meta's ability",
    "isRecorded": true
  },
  {
    "time": "07:49",
    "seconds": 469,
    "speaker": "CNBC Reporter",
    "text": "to appeal to teens before \nthey become adults who are far more valuable in terms \nof ad revenue.",
    "isRecorded": true
  },
  {
    "time": "07:55",
    "seconds": 475,
    "speaker": "CNBC Reporter",
    "text": "Kids are extremely valuable \nto Meta.",
    "isRecorded": true
  },
  {
    "time": "07:58",
    "seconds": 478,
    "speaker": "CNBC Reporter",
    "text": "We've seen evidence released \nin some of the other litigation with internal \nresearch that said, for instance, \nquote, the young ones are",
    "isRecorded": true
  },
  {
    "time": "08:06",
    "seconds": 486,
    "speaker": "CNBC Reporter",
    "text": "the best ones.",
    "isRecorded": true
  },
  {
    "time": "08:07",
    "seconds": 487,
    "speaker": "CNBC Reporter",
    "text": "And so it's actually pretty \ndevastating to Meta's current strategy to limit \nthe kind of hooks that they can put into young people.",
    "isRecorded": true
  },
  {
    "time": "08:18",
    "seconds": 498,
    "speaker": "CNBC Reporter",
    "text": "And while Meta has settled \nthis case, it's far from the end of the \nroad for the company and the other social media companies \nfacing lawsuits.",
    "isRecorded": true
  },
  {
    "time": "08:25",
    "seconds": 505,
    "speaker": "CNBC Reporter",
    "text": "There are still other cases, the schools case and \nindividual lawsuits that remain up in the air. It's \nuncertain how those are going to be resolved, \nbut i think it's probable",
    "isRecorded": true
  },
  {
    "time": "08:35",
    "seconds": 515,
    "speaker": "CNBC Reporter",
    "text": "that those get resolved at a \nmuch lower amount than the state AGs case.",
    "isRecorded": true
  },
  {
    "time": "08:38",
    "seconds": 518,
    "speaker": "CNBC Reporter",
    "text": "TikTok, Snap, \nand Google, who has YouTube.",
    "isRecorded": true
  },
  {
    "time": "08:42",
    "seconds": 522,
    "speaker": "CNBC Reporter",
    "text": "There has to be an industry \nwide solution.",
    "isRecorded": true
  },
  {
    "time": "08:44",
    "seconds": 524,
    "speaker": "CNBC Reporter",
    "text": "There are cases in some of \nthose companies coming up soon. There is a wide \nagreement among the AGs, and this was a bipartisan \neffort of essentially every",
    "isRecorded": true
  },
  {
    "time": "08:54",
    "seconds": 534,
    "speaker": "CNBC Reporter",
    "text": "AG in the United States.",
    "isRecorded": true
  },
  {
    "time": "08:56",
    "seconds": 536,
    "speaker": "CNBC Reporter",
    "text": "So yes, these other \ncompanies also need to change how they operate.",
    "isRecorded": true
  }
],
  "_RrAib0e1M0": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "ESPN Commentator",
    "text": "Theory is in Melbourne for Niners Rams tonight. What about 6:00 a.m. there? And Lindsay, the Rams just arrived yesterday. They're getting ready to go",
    "isRecorded": true
  },
  {
    "time": "00:07",
    "seconds": 7,
    "speaker": "ESPN Commentator",
    "text": "today. What's the leadup been like for this Rams team?",
    "isRecorded": true
  },
  {
    "time": "00:12",
    "seconds": 12,
    "speaker": "ESPN Commentator",
    "text": "H good morning from Melbourne, Laura. I can tell you they've been here for now 24 hours on the nose. The leadup after they landed, they went to their team",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "ESPN Commentator",
    "text": "hotel. They came to a walkthrough here at MCG. This is the 100,000 seat stadium they'll be playing in today. They had a short, very short walkth through at",
    "isRecorded": true
  },
  {
    "time": "00:30",
    "seconds": 30,
    "speaker": "ESPN Commentator",
    "text": "another stadium yesterday late afternoon. We were able to catch up with them. I spoke with Devonte Adams, of course, asked him how that plane ride",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "ESPN Commentator",
    "text": "overwent because that was going to be a key part of their strategic and specific plan. Adams telling me some guys slept really great on the plane. He personally",
    "isRecorded": true
  },
  {
    "time": "00:46",
    "seconds": 46,
    "speaker": "ESPN Commentator",
    "text": "not much of an airplane sleeper. So, that led you into yesterday evening for the Rams. So crucial to get a good night's sleep. They are expected to wake",
    "isRecorded": true
  },
  {
    "time": "00:54",
    "seconds": 54,
    "speaker": "ESPN Commentator",
    "text": "up this morning here in Melbourne about 3 to 4 am. Breakfast is being served in their hotel. The first buses for the Rams will be coming to the stadium in",
    "isRecorded": true
  },
  {
    "time": "01:03",
    "seconds": 63,
    "speaker": "ESPN Commentator",
    "text": "about an hour and 15 minutes. So, a whirlwind for them to say the least and that is quite different than the 49ers.",
    "isRecorded": true
  },
  {
    "time": "01:10",
    "seconds": 70,
    "speaker": "ESPN Commentator",
    "text": "They have now been here on the ground in Melbourne for a week. They had a leisurely day when they first got here.",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "ESPN Commentator",
    "text": "Came to an actually an AFL game at the stadium. They've had a normal practice routine throughout the week. Some of those guys even finding a uh spot that",
    "isRecorded": true
  },
  {
    "time": "01:23",
    "seconds": 83,
    "speaker": "ESPN Commentator",
    "text": "they'd like to go to for recovery and restoration. Uh they've found many coffee places they've enjoyed. So, a little bit more leisurely for the Niners",
    "isRecorded": true
  },
  {
    "time": "01:30",
    "seconds": 90,
    "speaker": "ESPN Commentator",
    "text": "as they prepared for this game. And that's actually been really good news for George KD and Nick Bosa. Laura, both of those guys have come off the injury",
    "isRecorded": true
  },
  {
    "time": "01:39",
    "seconds": 99,
    "speaker": "ESPN Commentator",
    "text": "report while here in Melbourne. They will play tonight. Kyle Shanahan saying they need to be smart with them and really kind of monitor their workload.",
    "isRecorded": true
  },
  {
    "time": "01:48",
    "seconds": 108,
    "speaker": "ESPN Commentator",
    "text": "Uh, but Brock Perie tells me that having George KD out there, he has looked so explosive during the practice week. So, they are very eager to see KD and Bosa",
    "isRecorded": true
  },
  {
    "time": "01:57",
    "seconds": 117,
    "speaker": "ESPN Commentator",
    "text": "return from those season ending injuries tonight against the Rams.",
    "isRecorded": true
  },
  {
    "time": "02:01",
    "seconds": 121,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah, good. They scouted this out when it came to the travel plan. They had sent some people over. They made sure that that was the way to go about it.",
    "isRecorded": true
  },
  {
    "time": "02:07",
    "seconds": 127,
    "speaker": "ESPN Commentator",
    "text": "We'll see which team ends up having the best travel plan as we welcome you into the show. We got Dan, Jac, and Field here. Adam Sheper is with us throughout",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "ESPN Commentator",
    "text": "as well. and J-Mack having Bosa out there big for the Ner's defense. Fred Warner is also back. I think we probably can't talk enough about that, but how",
    "isRecorded": true
  },
  {
    "time": "02:22",
    "seconds": 142,
    "speaker": "ESPN Commentator",
    "text": "can they slow down this Rams offense tonight?",
    "isRecorded": true
  },
  {
    "time": "02:24",
    "seconds": 144,
    "speaker": "ESPN Commentator",
    "text": ">> For me, it starts with them not having to blitz. Being able to rush forward, having BSA back is a huge part of that Diggy Zulu, he's come over from the",
    "isRecorded": true
  },
  {
    "time": "02:32",
    "seconds": 152,
    "speaker": "ESPN Commentator",
    "text": "Dallas Cowboys. Can those guys make Matthew Stafford a little bit uncomfortable? Can you get to him? Can you knock him on the ground? Can you get",
    "isRecorded": true
  },
  {
    "time": "02:40",
    "seconds": 160,
    "speaker": "ESPN Commentator",
    "text": "sacks? because if not, he's going to dice you up if you decide to blitz him.",
    "isRecorded": true
  },
  {
    "time": "02:44",
    "seconds": 164,
    "speaker": "ESPN Commentator",
    "text": "Last year in their second game, they went and blitzed over 40% of his dropbacks. What did Matthew Stafford do when they blitz him? Well, he was 13 of",
    "isRecorded": true
  },
  {
    "time": "02:52",
    "seconds": 172,
    "speaker": "ESPN Commentator",
    "text": "18, 161 yards, and four touchdowns. So for the San Francisco 49ers, you want to be able to keep guys in coverage and try to get around Devonte Adams, Puka Nak,",
    "isRecorded": true
  },
  {
    "time": "03:03",
    "seconds": 183,
    "speaker": "ESPN Commentator",
    "text": "and all of those guys as much as possible without having to send linebackers or guys from the secondary because when you do that to an old",
    "isRecorded": true
  },
  {
    "time": "03:10",
    "seconds": 190,
    "speaker": "ESPN Commentator",
    "text": "veteran, he's going to know exactly where you're coming from and where to go with the football.",
    "isRecorded": true
  },
  {
    "time": "03:14",
    "seconds": 194,
    "speaker": "ESPN Commentator",
    "text": ">> Fully agree. I've got two quick questions for Dan. Any truth to the rumor that your trip from New York City to Bristol today was longer than the",
    "isRecorded": true
  },
  {
    "time": "03:22",
    "seconds": 202,
    "speaker": "ESPN Commentator",
    "text": "Rams trip to Australia?",
    "isRecorded": true
  },
  {
    "time": "03:23",
    "seconds": 203,
    "speaker": "ESPN Commentator",
    "text": ">> I didn't have the lay down airplane that they took, so But I don't know if he's as long as he certainly felt that way.",
    "isRecorded": true
  },
  {
    "time": "03:29",
    "seconds": 209,
    "speaker": "ESPN Commentator",
    "text": ">> Ram was on a 4hour tour.",
    "isRecorded": true
  },
  {
    "time": "03:33",
    "seconds": 213,
    "speaker": "ESPN Commentator",
    "text": ">> Very efficient trip here for the Rams.",
    "isRecorded": true
  },
  {
    "time": "03:34",
    "seconds": 214,
    "speaker": "ESPN Commentator",
    "text": "Second of all, who was the least hit quarterback in the NFL last year? You >> Stafford.",
    "isRecorded": true
  },
  {
    "time": "03:38",
    "seconds": 218,
    "speaker": "ESPN Commentator",
    "text": ">> Stafford. Uh, and I just don't think that this Niners team can compete meaningfully with the powers that I think will be in the NFC, not just the",
    "isRecorded": true
  },
  {
    "time": "03:45",
    "seconds": 225,
    "speaker": "ESPN Commentator",
    "text": "NFC West, but the entire NFC, meaning >> Los Angeles and Seattle, unless they find a way to get home. Jax started the thought. I'll continue it with this.",
    "isRecorded": true
  },
  {
    "time": "03:53",
    "seconds": 233,
    "speaker": "ESPN Commentator",
    "text": "This has to be the most improved pass rush in the NFL because they were the worst pass rush in the NFL last season.",
    "isRecorded": true
  },
  {
    "time": "03:58",
    "seconds": 238,
    "speaker": "ESPN Commentator",
    "text": "I understand injuries really decimated that. Just go look at the numbers though. They were at the bottom or very near the bottom in pretty much any pass",
    "isRecorded": true
  },
  {
    "time": "04:05",
    "seconds": 245,
    "speaker": "ESPN Commentator",
    "text": "rush metric that you care. Total sacks, total pressures, pass rush win rate. No, Nick Bosa was gigantic in contributing to that. Mike Keel Williams, a ninth",
    "isRecorded": true
  },
  {
    "time": "04:14",
    "seconds": 254,
    "speaker": "ESPN Commentator",
    "text": "overall pick in the draft last year, missed most of his season because of an ACL tear. They have to find a way to make Matthew Stafford uncomfortable. And",
    "isRecorded": true
  },
  {
    "time": "04:21",
    "seconds": 261,
    "speaker": "ESPN Commentator",
    "text": "if they don't, then they won't win the game tonight. And they won't win the games that really matter come January.",
    "isRecorded": true
  },
  {
    "time": "04:26",
    "seconds": 266,
    "speaker": "ESPN Commentator",
    "text": "We saw this with San Francisco. They were at times a wagon offensively, at times good enough defensively, but when the rubber met the road in a critical",
    "isRecorded": true
  },
  {
    "time": "04:35",
    "seconds": 275,
    "speaker": "ESPN Commentator",
    "text": "game against Seattle late in the regular season, and then once again in the playoffs, they just weren't good enough defensively.",
    "isRecorded": true
  },
  {
    "time": "04:39",
    "seconds": 279,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah, I'll be interested to see how the defense changes. Remember, Robert Salah, the defensive coordinator, now >> head coach in Tennessee. Raheem Morris",
    "isRecorded": true
  },
  {
    "time": "04:47",
    "seconds": 287,
    "speaker": "ESPN Commentator",
    "text": "comes over the ex head coach of the Atlanta Falcons. also has a decent understanding of who Shawn McVey is as a play caller, right? They spend their",
    "isRecorded": true
  },
  {
    "time": "04:56",
    "seconds": 296,
    "speaker": "ESPN Commentator",
    "text": "times. Have you ever been a part of a defense that, you know, just changed coordinators >> and did they transfer technology or terminology? Do they carry it over? Is",
    "isRecorded": true
  },
  {
    "time": "05:07",
    "seconds": 307,
    "speaker": "ESPN Commentator",
    "text": "there a philosophical change? Because there's a little bit of like who's this Niners defense going to be under Raheem Morris in this version with some of",
    "isRecorded": true
  },
  {
    "time": "05:14",
    "seconds": 314,
    "speaker": "ESPN Commentator",
    "text": "those pieces coming back. Is that a huge I know offensively it was always like well carry over the terminology but that guy wants to put his own spin on things",
    "isRecorded": true
  },
  {
    "time": "05:21",
    "seconds": 321,
    "speaker": "ESPN Commentator",
    "text": "as well.",
    "isRecorded": true
  },
  {
    "time": "05:22",
    "seconds": 322,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah. We never had that like when new coordinator came in it was all of his stuff different coverages different terminology.",
    "isRecorded": true
  },
  {
    "time": "05:28",
    "seconds": 328,
    "speaker": "ESPN Commentator",
    "text": ">> Didn't carry over any of the >> car didn't care. It just you have your own way of doing things >> and Raheem's been a head coach not a DC.",
    "isRecorded": true
  },
  {
    "time": "05:34",
    "seconds": 334,
    "speaker": "ESPN Commentator",
    "text": "He was very involved in Atlanta's defensive coordination but like still you know he's he hasn't done this in a little bit.",
    "isRecorded": true
  },
  {
    "time": "05:39",
    "seconds": 339,
    "speaker": "ESPN Commentator",
    "text": ">> And I think it's like Robert Salah plays you know zone but it's an aggressive zone. It's like a hunch you zone where I think Raheem Morris for most of his",
    "isRecorded": true
  },
  {
    "time": "05:48",
    "seconds": 348,
    "speaker": "ESPN Commentator",
    "text": "career is like a bend but don't break type of zone. He'll give you yards, try to take away points. And so I think starting tonight we'll find out a little",
    "isRecorded": true
  },
  {
    "time": "05:56",
    "seconds": 356,
    "speaker": "ESPN Commentator",
    "text": "bit of how philosophically they want to play. But I agree with you like if they don't get close to Matthew, good luck.",
    "isRecorded": true
  },
  {
    "time": "06:02",
    "seconds": 362,
    "speaker": "ESPN Commentator",
    "text": ">> And I think to your point like Kyle Shanahan has some say in that as well.",
    "isRecorded": true
  },
  {
    "time": "06:05",
    "seconds": 365,
    "speaker": "ESPN Commentator",
    "text": "Remember when Steve Wilks was there, it wasn't the style of defense he really saw way too aggressive. Yes. So I think even Kyle Shanahan still he's going to",
    "isRecorded": true
  },
  {
    "time": "06:13",
    "seconds": 373,
    "speaker": "ESPN Commentator",
    "text": "have his hand there and exactly what he wants that defense to look like as well.",
    "isRecorded": true
  },
  {
    "time": "06:17",
    "seconds": 377,
    "speaker": "ESPN Commentator",
    "text": ">> Again no matter we're going to break it down from every single angle, but first there were two big injuries. So let's welcome in Adam Sheper for more on",
    "isRecorded": true
  },
  {
    "time": "06:23",
    "seconds": 383,
    "speaker": "ESPN Commentator",
    "text": "those. Adam, what's the latest on Sam Darnold?",
    "isRecorded": true
  },
  {
    "time": "06:26",
    "seconds": 386,
    "speaker": "ESPN Commentator",
    "text": ">> Laura, this was in the words of Mike McDonald, the CLA head coach, great great news because this could have been worse. But Sam Darnold had an MRI today",
    "isRecorded": true
  },
  {
    "time": "06:35",
    "seconds": 395,
    "speaker": "ESPN Commentator",
    "text": "and it did not show any significant injuries. There is pain and discomfort in that hip area. He now is expected to miss some time. It'll be at least week",
    "isRecorded": true
  },
  {
    "time": "06:46",
    "seconds": 406,
    "speaker": "ESPN Commentator",
    "text": "two against the Arizona Cardinals.",
    "isRecorded": true
  },
  {
    "time": "06:48",
    "seconds": 408,
    "speaker": "ESPN Commentator",
    "text": "Possibly another week or two, but the the Seahawks feel like, in their words, they dodged a bullet. The Patriots, on the other hand, suffered what might have",
    "isRecorded": true
  },
  {
    "time": "06:56",
    "seconds": 416,
    "speaker": "ESPN Commentator",
    "text": "been a more significant injury. AJ Brown has a high ankle sprain. It is likely to sideline him multiple weeks. Doctors are reviewing the MRIs, the tests to",
    "isRecorded": true
  },
  {
    "time": "07:07",
    "seconds": 427,
    "speaker": "ESPN Commentator",
    "text": "determine exactly how long he'll be sideline. But after going down last night, turning his ankle, reaching for it, and limping off the field, the",
    "isRecorded": true
  },
  {
    "time": "07:15",
    "seconds": 435,
    "speaker": "ESPN Commentator",
    "text": "Patriots know that they're now going to be without AJ Brown moving forward. And when he left the game last night, not that he had a huge impact while he was",
    "isRecorded": true
  },
  {
    "time": "07:23",
    "seconds": 443,
    "speaker": "ESPN Commentator",
    "text": "there, it felt like this offense really struggled to recover without him.",
    "isRecorded": true
  },
  {
    "time": "07:28",
    "seconds": 448,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah, it was a bummer. I mean, we're all so excited to see what this offense looked like with AJ Brown. And there are other issues with the offensive",
    "isRecorded": true
  },
  {
    "time": "07:33",
    "seconds": 453,
    "speaker": "ESPN Commentator",
    "text": "operation that we'll get to, but let's zero in on Sam Darnold and the defending Super Bowl champs coming up for the Seahawks. They got the Cardinals, they",
    "isRecorded": true
  },
  {
    "time": "07:40",
    "seconds": 460,
    "speaker": "ESPN Commentator",
    "text": "got the Commanders, the Chargers October 4th. Maybe he's back by then. But if Darnold misses a little bit, can Drew Lock hold it down for him?",
    "isRecorded": true
  },
  {
    "time": "07:48",
    "seconds": 468,
    "speaker": "ESPN Commentator",
    "text": ">> If they get the guy they got last night, yeah, they won the defense schedule.",
    "isRecorded": true
  },
  {
    "time": "07:52",
    "seconds": 472,
    "speaker": "ESPN Commentator",
    "text": ">> There's that schedule. I agree. I not brutal defenses over the next couple weeks. Chargers are good. Um, if they get Drew Lock the way they did last",
    "isRecorded": true
  },
  {
    "time": "08:00",
    "seconds": 480,
    "speaker": "ESPN Commentator",
    "text": "night, yes, that defense will keep them in every game. We spent a lot of today talking about Drake May. Drew Lockach was great last night. He was the best",
    "isRecorded": true
  },
  {
    "time": "08:09",
    "seconds": 489,
    "speaker": "ESPN Commentator",
    "text": "quarterback on the field last night. He was decisive. He was accurate with the ball down the field. He didn't take unnecessary sacks. He knew where to go",
    "isRecorded": true
  },
  {
    "time": "08:17",
    "seconds": 497,
    "speaker": "ESPN Commentator",
    "text": "with the checkown. When the protection broke down, he took off as a runner. He did exactly what was necessary for them to win that game. And if that's the",
    "isRecorded": true
  },
  {
    "time": "08:26",
    "seconds": 506,
    "speaker": "ESPN Commentator",
    "text": "maturity that he's going to play with with that defense, can he keep them afloat for a couple weeks? Absolutely.",
    "isRecorded": true
  },
  {
    "time": "08:33",
    "seconds": 513,
    "speaker": "ESPN Commentator",
    "text": "Drew Lockach was phenomenal last night.",
    "isRecorded": true
  },
  {
    "time": "08:35",
    "seconds": 515,
    "speaker": "ESPN Commentator",
    "text": "As long as it's a couple weeks injury and not like six to eight weeks or longer than that, then I think this is team is going to be totally fine.",
    "isRecorded": true
  },
  {
    "time": "08:41",
    "seconds": 521,
    "speaker": "ESPN Commentator",
    "text": "Because the reality when you're the defending champs, you can speak to this JMack, is that we don't measure how the season is going or what the impact is of",
    "isRecorded": true
  },
  {
    "time": "08:48",
    "seconds": 528,
    "speaker": "ESPN Commentator",
    "text": "an injury by how do you perform in week two or week three. It's are you going to be there when it matters most. over the next couple weeks they can win both of",
    "isRecorded": true
  },
  {
    "time": "08:56",
    "seconds": 536,
    "speaker": "ESPN Commentator",
    "text": "those games with Drew Lock.",
    "isRecorded": true
  },
  {
    "time": "08:58",
    "seconds": 538,
    "speaker": "ESPN Commentator",
    "text": ">> If it goes longer than that, I really believe the Super Bowl was won last season, December 18th, when the Seahawks come back in overtime and beat the Rams",
    "isRecorded": true
  },
  {
    "time": "09:09",
    "seconds": 549,
    "speaker": "ESPN Commentator",
    "text": "to give them the leg up on homefield advantage. They play them at home in the playoffs. They win that game of the divisional round. Homefield advantage",
    "isRecorded": true
  },
  {
    "time": "09:16",
    "seconds": 556,
    "speaker": "ESPN Commentator",
    "text": "matters so much in the NFC to me especially. And if this is a sick tweak to injury, then this team might fall behind against this Los Angeles Rams",
    "isRecorded": true
  },
  {
    "time": "09:24",
    "seconds": 564,
    "speaker": "ESPN Commentator",
    "text": "team that of course feels like it's kind of allin for this year. But for the next couple weeks, I think Drew Lock can more than hold it down.",
    "isRecorded": true
  },
  {
    "time": "09:30",
    "seconds": 570,
    "speaker": "ESPN Commentator",
    "text": ">> On the Patriots side of this with the injury to AJ Brown coming up, they've got the Steelers, the Jaguars, the Bills, uh the Raiders, the Jets. So",
    "isRecorded": true
  },
  {
    "time": "09:39",
    "seconds": 579,
    "speaker": "ESPN Commentator",
    "text": "there it starts out with a bit of a gauntlet there. Jac, if you think about AJ Brown being out for a few games, there's the schedule on your screen.",
    "isRecorded": true
  },
  {
    "time": "09:46",
    "seconds": 586,
    "speaker": "ESPN Commentator",
    "text": "What does that mean for this Patriots offense? You got to adjust and I think all summer they had AJ Brown in there and you're starting to figure out",
    "isRecorded": true
  },
  {
    "time": "09:54",
    "seconds": 594,
    "speaker": "ESPN Commentator",
    "text": "exactly the relationship between him and Drake May and you saw that chemistry a little bit early on in that game. Moving forward for Josh McDaniels, how do you",
    "isRecorded": true
  },
  {
    "time": "10:02",
    "seconds": 602,
    "speaker": "ESPN Commentator",
    "text": "get some more space in the run game?",
    "isRecorded": true
  },
  {
    "time": "10:04",
    "seconds": 604,
    "speaker": "ESPN Commentator",
    "text": "They he continued to run the football last night and they ran it with the running backs 24 times for 62 yards.",
    "isRecorded": true
  },
  {
    "time": "10:10",
    "seconds": 610,
    "speaker": "ESPN Commentator",
    "text": "They were lacking production there. If you can get some space in a run game, it opens up everything else. And I think as they're starting to see man coverage,",
    "isRecorded": true
  },
  {
    "time": "10:18",
    "seconds": 618,
    "speaker": "ESPN Commentator",
    "text": "Pop Douglas to me is a guy that they have to get involved with. He's somebody that can create separation and find some room for Drake May to be able to get the",
    "isRecorded": true
  },
  {
    "time": "10:26",
    "seconds": 626,
    "speaker": "ESPN Commentator",
    "text": "ball in there. All of this has to take place. The quarterback has to play better. You can't make the mistakes he made in the fourth quarter trying to",
    "isRecorded": true
  },
  {
    "time": "10:33",
    "seconds": 633,
    "speaker": "ESPN Commentator",
    "text": "force the ball and make plays down the field. It's going to start with him for them to be able to do anything to get better.",
    "isRecorded": true
  },
  {
    "time": "10:39",
    "seconds": 639,
    "speaker": "ESPN Commentator",
    "text": ">> More on that coming.",
    "isRecorded": true
  },
  {
    "time": "10:40",
    "seconds": 640,
    "speaker": "ESPN Commentator",
    "text": ">> Oh, I was just going to say Laura. 51 rushing yards for Reandre Stevenson last night. 50 of them after first contact.",
    "isRecorded": true
  },
  {
    "time": "10:46",
    "seconds": 646,
    "speaker": "ESPN Commentator",
    "text": "50 out of 51.",
    "isRecorded": true
  },
  {
    "time": "10:47",
    "seconds": 647,
    "speaker": "ESPN Commentator",
    "text": ">> You know, decisions that cost us the game, you know, on my part and on my end. And um, you know, I vowed myself to to be better and realize it's, you know,",
    "isRecorded": true
  },
  {
    "time": "10:56",
    "seconds": 656,
    "speaker": "ESPN Commentator",
    "text": "it's a long season, but at the same time, you can't have those. You can't have those. And, um, it's unacceptable.",
    "isRecorded": true
  },
  {
    "time": "11:00",
    "seconds": 660,
    "speaker": "ESPN Commentator",
    "text": "And I know that, uh, you got to get back to work cuz, you know, that wasn't, you know, how I play football and and how I want to represent um, you know, my game",
    "isRecorded": true
  },
  {
    "time": "11:07",
    "seconds": 667,
    "speaker": "ESPN Commentator",
    "text": "and and, you know, playing quarterback for the Patriots.",
    "isRecorded": true
  },
  {
    "time": "11:11",
    "seconds": 671,
    "speaker": "ESPN Commentator",
    "text": "So last season, Drake May awesome throwing deep, leading the NFL with a 95 total QVR on passes, thrown more than 10 yards downfield with 14 touchdowns and",
    "isRecorded": true
  },
  {
    "time": "11:21",
    "seconds": 681,
    "speaker": "ESPN Commentator",
    "text": "six picks. Last night though, a disaster on those throws. Two for seven with no touchdowns and three interceptions.",
    "isRecorded": true
  },
  {
    "time": "11:27",
    "seconds": 687,
    "speaker": "ESPN Commentator",
    "text": "Could have had something to do with that Seattle defense. But Dan, what went wrong with May on those interceptions?",
    "isRecorded": true
  },
  {
    "time": "11:32",
    "seconds": 692,
    "speaker": "ESPN Commentator",
    "text": ">> First time. First time using the new touch screen. So >> fire her up.",
    "isRecorded": true
  },
  {
    "time": "11:35",
    "seconds": 695,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah. Yeah. Big one. um inexplainable self-inflicted wounds on all three of them and they're very black and white.",
    "isRecorded": true
  },
  {
    "time": "11:44",
    "seconds": 704,
    "speaker": "ESPN Commentator",
    "text": "Okay, so the first interception, this is going to be second and nine. They had run this look and kind of action four times before through the checkdown.",
    "isRecorded": true
  },
  {
    "time": "11:51",
    "seconds": 711,
    "speaker": "ESPN Commentator",
    "text": "They're trying to get dos on what we call this rail shot down the sideline.",
    "isRecorded": true
  },
  {
    "time": "11:55",
    "seconds": 715,
    "speaker": "ESPN Commentator",
    "text": "Now cover two for Seattle. Cover two simply is this corner zone flat safety zone half to field. Now to throw that rail shot, two things have to happen to",
    "isRecorded": true
  },
  {
    "time": "12:05",
    "seconds": 725,
    "speaker": "ESPN Commentator",
    "text": "the quarterback. Not one but two. One, that safety who has the deep half, he has to kind of lean towards that hash and that corner has to stay low and not",
    "isRecorded": true
  },
  {
    "time": "12:14",
    "seconds": 734,
    "speaker": "ESPN Commentator",
    "text": "drift up field. Everybody at home, you don't play quarterback in the NFL, but you could tell me, should that ball get thrown or not? No, the safety stays",
    "isRecorded": true
  },
  {
    "time": "12:21",
    "seconds": 741,
    "speaker": "ESPN Commentator",
    "text": "wide. The corner drops deep. Drake May, for some reason, instead of checking the ball down to the back like he did the first four times they had run that play,",
    "isRecorded": true
  },
  {
    "time": "12:29",
    "seconds": 749,
    "speaker": "ESPN Commentator",
    "text": "takes that shot downfield. Even though the Seahawks have no life in this game, that interception breeds life. Okay, third and 14. Unlikely to convert",
    "isRecorded": true
  },
  {
    "time": "12:37",
    "seconds": 757,
    "speaker": "ESPN Commentator",
    "text": "against the defense and a pass rush like Seattle. There's been a lot of conversation of what this coverage is actually called. It doesn't really",
    "isRecorded": true
  },
  {
    "time": "12:44",
    "seconds": 764,
    "speaker": "ESPN Commentator",
    "text": "matter. The play is called 989. Go route on the outside, go route on the outside.",
    "isRecorded": true
  },
  {
    "time": "12:48",
    "seconds": 768,
    "speaker": "ESPN Commentator",
    "text": "And the slot receiver has two routes really. He can either go post or dig depending on the safeties. Now, this safety is really the guy who tells the",
    "isRecorded": true
  },
  {
    "time": "12:57",
    "seconds": 777,
    "speaker": "ESPN Commentator",
    "text": "quarterback yes or no, you can throw that football. If the safety stays off the hash, if he gets width and depth, then you have a chance to maybe throw",
    "isRecorded": true
  },
  {
    "time": "13:07",
    "seconds": 787,
    "speaker": "ESPN Commentator",
    "text": "the ball down the middle of the field.",
    "isRecorded": true
  },
  {
    "time": "13:09",
    "seconds": 789,
    "speaker": "ESPN Commentator",
    "text": "But Julian Love just stares right at Drake May the whole time. Look at him.",
    "isRecorded": true
  },
  {
    "time": "13:12",
    "seconds": 792,
    "speaker": "ESPN Commentator",
    "text": "He never moves off of that line. For some reason, Drake May throws the ball down the middle of the field. Even though Julian Love told him, \"Do not",
    "isRecorded": true
  },
  {
    "time": "13:20",
    "seconds": 800,
    "speaker": "ESPN Commentator",
    "text": "throw that ball down the middle of the field.\" And on third and 14, he gives them three more points. Now, let's go to the end of the game. Okay, it's third",
    "isRecorded": true
  },
  {
    "time": "13:27",
    "seconds": 807,
    "speaker": "ESPN Commentator",
    "text": "and five. You have one timeout, you're down three, you're in field goal range.",
    "isRecorded": true
  },
  {
    "time": "13:34",
    "seconds": 814,
    "speaker": "ESPN Commentator",
    "text": "There's one thing you cannot do. Turn the ball over. It's a very simple concept. Quick little fade and a stick route to the tight end. You would read",
    "isRecorded": true
  },
  {
    "time": "13:42",
    "seconds": 822,
    "speaker": "ESPN Commentator",
    "text": "this as a quarterback like one to two very quickly. You're just trying to take a shot and if it doesn't work out, it doesn't work out. A couple things. One,",
    "isRecorded": true
  },
  {
    "time": "13:50",
    "seconds": 830,
    "speaker": "ESPN Commentator",
    "text": "as M. Holland goes inside, this is the receiver up top. Once he goes inside that corner, the play is essentially dead. You do not win the rep as the",
    "isRecorded": true
  },
  {
    "time": "13:58",
    "seconds": 838,
    "speaker": "ESPN Commentator",
    "text": "quarterback because your tackles are cutting. They think it's what we call three-step or quick game. They expect the ball to get out. The shot did not",
    "isRecorded": true
  },
  {
    "time": "14:06",
    "seconds": 846,
    "speaker": "ESPN Commentator",
    "text": "work. Instead of throwing the ball away or maybe throwing it at the feet of the tight end on that stick route, he drifts back into the pocket, floats the ball",
    "isRecorded": true
  },
  {
    "time": "14:15",
    "seconds": 855,
    "speaker": "ESPN Commentator",
    "text": "up, it's an interception. Those are those self-inflicted unforced errors. I don't credit Seattle for forcing those takeaways. To me,",
    "isRecorded": true
  },
  {
    "time": "14:26",
    "seconds": 866,
    "speaker": "ESPN Commentator",
    "text": "those three are all turnovers by Drake May that were forced by his decision-making. He's too good of a player to make all three of those",
    "isRecorded": true
  },
  {
    "time": "14:34",
    "seconds": 874,
    "speaker": "ESPN Commentator",
    "text": "mistakes in that fourth quarter.",
    "isRecorded": true
  }
],
  "oeJ61gX_TTU": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "ESPN Commentator",
    "text": "I went on social media last night just to catch up with everything going on in the sports world, but only one thing caught my eye and hurt my heart. Barry",
    "isRecorded": true
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "ESPN Commentator",
    "text": "Melrose, the face of our NHL coverage for over 25 years, had died. His wife Cindy delivered the news to our Steve Levy. Barry was diagnosed with",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "ESPN Commentator",
    "text": "Parkinson's disease in 2023 and retired from ESPN. We missed his insightful and fun commentary, his great suits, and that slick back hair. Mostly, we missed",
    "isRecorded": true
  },
  {
    "time": "00:33",
    "seconds": 33,
    "speaker": "ESPN Commentator",
    "text": "his smile, which he shared with everyone on camera and off. Here's Jeremy Shap.",
    "isRecorded": true
  },
  {
    "time": "00:43",
    "seconds": 43,
    "speaker": "ESPN Commentator",
    "text": ">> In hockey, there are legends like Gordy How and Maurice Rishard, Wayne Gretzky.",
    "isRecorded": true
  },
  {
    "time": "00:49",
    "seconds": 49,
    "speaker": "ESPN Commentator",
    "text": ">> TO GRETZKY SCORES. HE DID IT. HE did it.",
    "isRecorded": true
  },
  {
    "time": "00:53",
    "seconds": 53,
    "speaker": "ESPN Commentator",
    "text": "But the great players, all of them are associated primarily with their teams.",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "ESPN Commentator",
    "text": "Barry Melrose was different.",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "ESPN Commentator",
    "text": ">> Hi, I'm Barry Melrose, the hardest working sports announcer in the world.",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "ESPN Commentator",
    "text": ">> He was bigger than any team. For decades, he suited up, and we mean suited up for the game, for the sport, for hockey.",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "ESPN Commentator",
    "text": ">> Look at the shoes, man.",
    "isRecorded": true
  },
  {
    "time": "01:17",
    "seconds": 77,
    "speaker": "ESPN Commentator",
    "text": ">> He belonged to everyone who loves the game.",
    "isRecorded": true
  },
  {
    "time": "01:21",
    "seconds": 81,
    "speaker": "ESPN Commentator",
    "text": "That Melrose would rise to such prominence in the sport seemed at best unlikely when he was actually playing.",
    "isRecorded": true
  },
  {
    "time": "01:28",
    "seconds": 88,
    "speaker": "ESPN Commentator",
    "text": "Born and raised on the Canadian prairie in Saskatchewan, he was a fairly obscure defenseman in the WHA and NHL. Far from a star, but then in 1992, Melrose was",
    "isRecorded": true
  },
  {
    "time": "01:40",
    "seconds": 100,
    "speaker": "ESPN Commentator",
    "text": "hired as the head coach of the Los Angeles Kings. He was just 35.",
    "isRecorded": true
  },
  {
    "time": "01:45",
    "seconds": 105,
    "speaker": "ESPN Commentator",
    "text": ">> What I hope you guys will start realizing, we can beat anybody.",
    "isRecorded": true
  },
  {
    "time": "01:50",
    "seconds": 110,
    "speaker": "ESPN Commentator",
    "text": "He'd never coached a game in the NHL at the time. He was a minor league coach in the Redwing system, an upandcomer.",
    "isRecorded": true
  },
  {
    "time": "01:58",
    "seconds": 118,
    "speaker": "ESPN Commentator",
    "text": "But as soon as he took over, the Kings, led by number 99 himself, started winning.",
    "isRecorded": true
  },
  {
    "time": "02:05",
    "seconds": 125,
    "speaker": "ESPN Commentator",
    "text": "And the Kings win it.",
    "isRecorded": true
  },
  {
    "time": "02:08",
    "seconds": 128,
    "speaker": "ESPN Commentator",
    "text": ">> And that first year, they went all the way to the Stanley Cup final.",
    "isRecorded": true
  },
  {
    "time": "02:11",
    "seconds": 131,
    "speaker": "ESPN Commentator",
    "text": ">> The expectations were hopefully just to make the playoffs and how far they came.",
    "isRecorded": true
  },
  {
    "time": "02:16",
    "seconds": 136,
    "speaker": "ESPN Commentator",
    "text": "But within a couple of years of the 93 finals, which Los Angeles lost to Montreal, Melrose found his true calling.",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "ESPN Commentator",
    "text": ">> Bill Pedo along with Barry Melrose.",
    "isRecorded": true
  },
  {
    "time": "02:27",
    "seconds": 147,
    "speaker": "ESPN Commentator",
    "text": "What's going on?",
    "isRecorded": true
  },
  {
    "time": "02:28",
    "seconds": 148,
    "speaker": "ESPN Commentator",
    "text": ">> Not much, but I'm uh going to have a lot better preseason and regular season I had last year. I promise you.",
    "isRecorded": true
  },
  {
    "time": "02:33",
    "seconds": 153,
    "speaker": "ESPN Commentator",
    "text": ">> I hope so.",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "ESPN Commentator",
    "text": ">> So do I.",
    "isRecorded": true
  },
  {
    "time": "02:35",
    "seconds": 155,
    "speaker": "ESPN Commentator",
    "text": ">> And we also would have expected a haircut for the season debut.",
    "isRecorded": true
  },
  {
    "time": "02:38",
    "seconds": 158,
    "speaker": "ESPN Commentator",
    "text": ">> On TV, Barry was from day one. Barry, same guy. No mask, no artifice.",
    "isRecorded": true
  },
  {
    "time": "02:46",
    "seconds": 166,
    "speaker": "ESPN Commentator",
    "text": "Paul, come on back. It's not that bad, >> man. Should have got into the Gretzky stories quicker.",
    "isRecorded": true
  },
  {
    "time": "02:53",
    "seconds": 173,
    "speaker": "ESPN Commentator",
    "text": ">> And his showman's side shined through.",
    "isRecorded": true
  },
  {
    "time": "02:56",
    "seconds": 176,
    "speaker": "ESPN Commentator",
    "text": ">> I feel like Trey Conroy is serving up Derome McIn with some beautiful passes right now. Here you go, ladies.",
    "isRecorded": true
  },
  {
    "time": "03:04",
    "seconds": 184,
    "speaker": "ESPN Commentator",
    "text": ">> But when it came to his commentary, true to his upbringing on a farm, Melrose had no time for baloney, he told it like it was.",
    "isRecorded": true
  },
  {
    "time": "03:11",
    "seconds": 191,
    "speaker": "ESPN Commentator",
    "text": ">> Pittsburgh's struggling right now.",
    "isRecorded": true
  },
  {
    "time": "03:12",
    "seconds": 192,
    "speaker": "ESPN Commentator",
    "text": "They're a fragile team. They didn't play well at the end of the season. They didn't play particularly well in this game, game one.",
    "isRecorded": true
  },
  {
    "time": "03:22",
    "seconds": 202,
    "speaker": "ESPN Commentator",
    "text": ">> Without pandering, without talking down to fans, without sugar coating, Melrose brought the game to life for millions of fans.",
    "isRecorded": true
  },
  {
    "time": "03:29",
    "seconds": 209,
    "speaker": "ESPN Commentator",
    "text": ">> Couple months ago, Marty's with the Pope. Now he's with Melrose. How's his career going?",
    "isRecorded": true
  },
  {
    "time": "03:35",
    "seconds": 215,
    "speaker": "ESPN Commentator",
    "text": ">> Taking them inside the sport. And now we're going to try and make a turn here.",
    "isRecorded": true
  },
  {
    "time": "03:40",
    "seconds": 220,
    "speaker": "ESPN Commentator",
    "text": "It's my first turn with the Zamboni. I think you are the best analyst on television.",
    "isRecorded": true
  },
  {
    "time": "03:44",
    "seconds": 224,
    "speaker": "ESPN Commentator",
    "text": ">> You want proof? Here's some.",
    "isRecorded": true
  },
  {
    "time": "03:49",
    "seconds": 229,
    "speaker": "ESPN Commentator",
    "text": ">> What's going on down there? There's a cross check. There's an elbow. There's a knee. There's a slash. There's a headbutt.",
    "isRecorded": true
  },
  {
    "time": "03:57",
    "seconds": 237,
    "speaker": "ESPN Commentator",
    "text": ">> Another That's a double cross check.",
    "isRecorded": true
  },
  {
    "time": "04:00",
    "seconds": 240,
    "speaker": "ESPN Commentator",
    "text": ">> Oh, yes. The hair helped. The hair was beloved on its own terms. Your hair, what what's it called? Do you have a name for it?",
    "isRecorded": true
  },
  {
    "time": "04:07",
    "seconds": 247,
    "speaker": "ESPN Commentator",
    "text": ">> I just call it the Molly, but a lot of the other guys call it the Barry Mount Rose. Oh, I try to pull it back.",
    "isRecorded": true
  },
  {
    "time": "04:13",
    "seconds": 253,
    "speaker": "ESPN Commentator",
    "text": ">> That's good.",
    "isRecorded": true
  },
  {
    "time": "04:14",
    "seconds": 254,
    "speaker": "ESPN Commentator",
    "text": ">> And Barry loved the hair, too. If there's a mullet hall of fame, Barry would be a first ballad in Shrinee.",
    "isRecorded": true
  },
  {
    "time": "04:20",
    "seconds": 260,
    "speaker": "ESPN Commentator",
    "text": ">> You got a haircut? Yeah. Not sure if my playoff haircut. It's already starting to grow.",
    "isRecorded": true
  },
  {
    "time": "04:25",
    "seconds": 265,
    "speaker": "ESPN Commentator",
    "text": ">> You see, hockey is more than a game.",
    "isRecorded": true
  },
  {
    "time": "04:27",
    "seconds": 267,
    "speaker": "ESPN Commentator",
    "text": "It's community transcending borders. And Barry Melrose on TV was the leader of that community. From the farm to the pinnacle of the sport. Melrose stood for",
    "isRecorded": true
  },
  {
    "time": "04:37",
    "seconds": 277,
    "speaker": "ESPN Commentator",
    "text": "everything that is good and great about hockey. one timer.",
    "isRecorded": true
  },
  {
    "time": "04:41",
    "seconds": 281,
    "speaker": "ESPN Commentator",
    "text": ">> When the girl doesn't call back.",
    "isRecorded": true
  },
  {
    "time": "04:42",
    "seconds": 282,
    "speaker": "ESPN Commentator",
    "text": ">> Oh yeah, I like that footer there.",
    "isRecorded": true
  },
  {
    "time": "04:46",
    "seconds": 286,
    "speaker": "ESPN Commentator",
    "text": ">> And as much as the game gave him, he gave back. When his illness, his Parkinson's became public, there was an outpouring of love and support.",
    "isRecorded": true
  },
  {
    "time": "04:56",
    "seconds": 296,
    "speaker": "ESPN Commentator",
    "text": ">> Barry Melrose. Cool as a rule.",
    "isRecorded": true
  },
  {
    "time": "04:59",
    "seconds": 299,
    "speaker": "ESPN Commentator",
    "text": ">> Yes, without Barry Melrose, the game will go on, but it won't be as much fun.",
    "isRecorded": true
  },
  {
    "time": "05:08",
    "seconds": 308,
    "speaker": "ESPN Commentator",
    "text": "Jeremy Chap reporting. Uh Steve Levy saying this of Barry Melrose. For more than 30 years, Barry was the unquestioned face and voice of hockey in",
    "isRecorded": true
  },
  {
    "time": "05:18",
    "seconds": 318,
    "speaker": "ESPN Commentator",
    "text": "the United States. He was a man of the people, a family man, part of my family.",
    "isRecorded": true
  },
  {
    "time": "05:23",
    "seconds": 323,
    "speaker": "ESPN Commentator",
    "text": "Tonight, I'll toast to the kid from Kelton who made it big but never forgot his roots. Now he can drink all the Bud Lights, smoke all the cigars, and play",
    "isRecorded": true
  },
  {
    "time": "05:33",
    "seconds": 333,
    "speaker": "ESPN Commentator",
    "text": "all the rounds of golf he wants to.",
    "isRecorded": true
  },
  {
    "time": "05:35",
    "seconds": 335,
    "speaker": "ESPN Commentator",
    "text": "Barry Melrose was the best of us.",
    "isRecorded": true
  },
  {
    "time": "05:40",
    "seconds": 340,
    "speaker": "ESPN Commentator",
    "text": "Our John Butcheros joining us now.",
    "isRecorded": true
  },
  {
    "time": "05:42",
    "seconds": 342,
    "speaker": "ESPN Commentator",
    "text": "Longtime colleague and friend doesn't even begin to describe yours and Barry's relationship. John, in sharing your memories of Barry on social media, you",
    "isRecorded": true
  },
  {
    "time": "05:51",
    "seconds": 351,
    "speaker": "ESPN Commentator",
    "text": "referred to him as a big brother figure with rock solid values. Why'd you say that?",
    "isRecorded": true
  },
  {
    "time": "05:59",
    "seconds": 359,
    "speaker": "ESPN Commentator",
    "text": "Well, Jay, here I am in a hockey locker room in Nevada, appropriately so, as we talk about Barry Muros. Grew up on a farm uh in Saskatchewan, about 897",
    "isRecorded": true
  },
  {
    "time": "06:09",
    "seconds": 369,
    "speaker": "ESPN Commentator",
    "text": "people, just depending on the day. Hard work up at dawn. Saw things at a young age in terms of farm animals and what you do on a farm. uh tough as nails show",
    "isRecorded": true
  },
  {
    "time": "06:24",
    "seconds": 384,
    "speaker": "ESPN Commentator",
    "text": "up early as you know he did for every sports center segment in his suit and tie 6:00 for Barry that was 5:45 so just seeing that how he treated people every",
    "isRecorded": true
  },
  {
    "time": "06:36",
    "seconds": 396,
    "speaker": "ESPN Commentator",
    "text": "picture he took with everybody who asked every autograph he signed when autographs were a thing um just seeing him how he treated people how charming",
    "isRecorded": true
  },
  {
    "time": "06:44",
    "seconds": 404,
    "speaker": "ESPN Commentator",
    "text": "he was how he made everyone's day um that that's why when I talk about um a big brother figure and almost like a mentor to say I mean I felt like I",
    "isRecorded": true
  },
  {
    "time": "06:56",
    "seconds": 416,
    "speaker": "ESPN Commentator",
    "text": "always treated people well as you do and uh but for someone like him who was such a star to everyone was the same uh to Barry even if you couldn't do anything",
    "isRecorded": true
  },
  {
    "time": "07:05",
    "seconds": 425,
    "speaker": "ESPN Commentator",
    "text": "for him he treated you like gold >> indeed yes he did what did Barry Melrose mean to the game of hockey >> well like Steve said Jay he was the face",
    "isRecorded": true
  },
  {
    "time": "07:17",
    "seconds": 437,
    "speaker": "ESPN Commentator",
    "text": "in this country he should be in the hockey Hall of Fame. He should have won the Lester Patrick Award for contributions to American hockey. Uh by",
    "isRecorded": true
  },
  {
    "time": "07:24",
    "seconds": 444,
    "speaker": "ESPN Commentator",
    "text": "now he should be in the US Hockey Hall of Fame. This was the man because of his sports center crossover appeal. He wasn't just in the hockey department of",
    "isRecorded": true
  },
  {
    "time": "07:34",
    "seconds": 454,
    "speaker": "ESPN Commentator",
    "text": "the hockey department store. He was the entire store of sports. And because he stuck with ESPN after we lost the NHL in 2004, again, Barry, Charles Barkley",
    "isRecorded": true
  },
  {
    "time": "07:44",
    "seconds": 464,
    "speaker": "ESPN Commentator",
    "text": "called him the best analyst. when Charles said that because he knew Barry was a rock star, because he had charisma, because you know, Lil Wayne",
    "isRecorded": true
  },
  {
    "time": "07:53",
    "seconds": 473,
    "speaker": "ESPN Commentator",
    "text": "posted today on X about how he was crying over Barry Melrose's death because Lil Wayne, we know, is a huge Sports Center fan. So Barry just wasn't",
    "isRecorded": true
  },
  {
    "time": "08:01",
    "seconds": 481,
    "speaker": "ESPN Commentator",
    "text": "a hockey broadcaster. He was a broadcaster. He was a media star. He came from a time for us when, you know, ESPN and Sports Center are on the rise.",
    "isRecorded": true
  },
  {
    "time": "08:12",
    "seconds": 492,
    "speaker": "ESPN Commentator",
    "text": "He he Dan Levitard really said it well today about he's he's comes from a time and for me it's like that favorite song we remember the summer after our senior",
    "isRecorded": true
  },
  {
    "time": "08:22",
    "seconds": 502,
    "speaker": "ESPN Commentator",
    "text": "year of high school you know and what it brings it brings us back so Barry brings us back to a time he's that big he cast that big a shadow in the American sports",
    "isRecorded": true
  },
  {
    "time": "08:32",
    "seconds": 512,
    "speaker": "ESPN Commentator",
    "text": "scene I began with him on NHL tonight in 1998 we covered hockey starting 2006 I was with him with his last assignment with ESPN which was the Frozen Four",
    "isRecorded": true
  },
  {
    "time": "08:42",
    "seconds": 522,
    "speaker": "ESPN Commentator",
    "text": "championship in Tampa in 2023, Quinnipic's amazing overtime win over Minnesota. So, my NCAA days with Barry uh really are were so touching. We'd",
    "isRecorded": true
  },
  {
    "time": "08:53",
    "seconds": 533,
    "speaker": "ESPN Commentator",
    "text": "walk into a restaurant and everybody would look at him, even people who didn't know him, most people knew him because he was a star, but even if you",
    "isRecorded": true
  },
  {
    "time": "09:00",
    "seconds": 540,
    "speaker": "ESPN Commentator",
    "text": "didn't know him, you said to yourself, \"That guy is somebody.\" There's something about that guy, a John Wayne, Johnny Cash, rockstar, Jeff Bridges, how",
    "isRecorded": true
  },
  {
    "time": "09:11",
    "seconds": 551,
    "speaker": "ESPN Commentator",
    "text": "he has aged from a young Jeff Bridges, uh, to become this character with the beard and the mullet and the hair. He was just a rock star. It was like being",
    "isRecorded": true
  },
  {
    "time": "09:19",
    "seconds": 559,
    "speaker": "ESPN Commentator",
    "text": "with Elvis and what a life from that farm in Kelvington to being a coach of Wayne Gretzky and the LA Kings, walking into your office after a tough loss and",
    "isRecorded": true
  },
  {
    "time": "09:28",
    "seconds": 568,
    "speaker": "ESPN Commentator",
    "text": "there's Goldie Han sitting on your desk cuz her and Kurt Russell want to come down and said hi. That was the life of Barry Melrose. Unimaginable. Truly",
    "isRecorded": true
  },
  {
    "time": "09:36",
    "seconds": 576,
    "speaker": "ESPN Commentator",
    "text": "Disney movie stuff. And how much did he love working at ESPN, Jay? We were his family. He loved ESPN more than anybody has loved ESPN.",
    "isRecorded": true
  },
  {
    "time": "09:47",
    "seconds": 587,
    "speaker": "ESPN Commentator",
    "text": ">> When he walked on the campus, when he walked out on the set, you knew it was going to be a very, very good day.",
    "isRecorded": true
  },
  {
    "time": "09:52",
    "seconds": 592,
    "speaker": "ESPN Commentator",
    "text": ">> Very good day.",
    "isRecorded": true
  },
  {
    "time": "09:52",
    "seconds": 592,
    "speaker": "ESPN Commentator",
    "text": ">> Smoking that stogy.",
    "isRecorded": true
  },
  {
    "time": "09:54",
    "seconds": 594,
    "speaker": "ESPN Commentator",
    "text": ">> John Butcher Goss. Thank you, brother.",
    "isRecorded": true
  },
  {
    "time": "09:55",
    "seconds": 595,
    "speaker": "ESPN Commentator",
    "text": "Appreciate you.",
    "isRecorded": true
  },
  {
    "time": "09:57",
    "seconds": 597,
    "speaker": "ESPN Commentator",
    "text": ">> Stick top to you, Jay and Barry.",
    "isRecorded": true
  },
  {
    "time": "10:00",
    "seconds": 600,
    "speaker": "ESPN Commentator",
    "text": "Commissioner Gary Bman saying, \"Barry never failed to boost your love of the game.\" That was very true. We send our thoughts and prayers to his wife, Cindy,",
    "isRecorded": true
  },
  {
    "time": "10:09",
    "seconds": 609,
    "speaker": "ESPN Commentator",
    "text": "and their sons, Terrell and Adrien.",
    "isRecorded": true
  },
  {
    "time": "10:12",
    "seconds": 612,
    "speaker": "ESPN Commentator",
    "text": "Barry Melrose was 70 years old.",
    "isRecorded": true
  }
],
  "vntQITZwcu4": [
  {
    "time": "00:01",
    "seconds": 1,
    "speaker": "ESPN Commentator",
    "text": "We're ready for more football. Monday night, Patrick Mahomes makes his return to the Chiefs as they host the Denver Broncos. And under Shawn Payeyton last",
    "isRecorded": true
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "ESPN Commentator",
    "text": "season, the Broncos won the AFC West, snapping a nine season streak that was held by Kansas City. And we now on Big Day head to Denver where there's a",
    "isRecorded": true
  },
  {
    "time": "00:19",
    "seconds": 19,
    "speaker": "ESPN Commentator",
    "text": "familiar face staring back at us. It's Broncos head coach Shawn Payeyton.",
    "isRecorded": true
  },
  {
    "time": "00:23",
    "seconds": 23,
    "speaker": "ESPN Commentator",
    "text": "Coach, welcome to the show.",
    "isRecorded": true
  },
  {
    "time": "00:26",
    "seconds": 26,
    "speaker": "ESPN Commentator",
    "text": ">> Um, listen, I'm excited to be on your show. Congrats first off >> for getting a show. Um, >> that's a big deal and uh I'm happy to",
    "isRecorded": true
  },
  {
    "time": "00:35",
    "seconds": 35,
    "speaker": "ESPN Commentator",
    "text": "see you doing well. You know, just our time together at Fox and now you're moving on up.",
    "isRecorded": true
  },
  {
    "time": "00:40",
    "seconds": 40,
    "speaker": "ESPN Commentator",
    "text": ">> You're the man. I appreciate it. This is year 28 for you in the NFL as a coach and seeing all that ball last night knowing week one kickoff is a few days",
    "isRecorded": true
  },
  {
    "time": "00:48",
    "seconds": 48,
    "speaker": "ESPN Commentator",
    "text": "away. I got to ask, do you have the same excitement as those early days as a assistant coach in Philly and New York?",
    "isRecorded": true
  },
  {
    "time": "00:55",
    "seconds": 55,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah, absolutely. Um here here's why every team really in the offseason, you know, goes through the changes, um new players, they go through their spring,",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "ESPN Commentator",
    "text": "mini camps, training camp, and while they're doing that, they really have blinders to the other 31 teams relative to where they are at in the race, if you",
    "isRecorded": true
  },
  {
    "time": "01:15",
    "seconds": 75,
    "speaker": "ESPN Commentator",
    "text": "will. And so week one, it's like the start and you you can't draw a complete conclusion as to how the race is going to end, but you start seeing the other",
    "isRecorded": true
  },
  {
    "time": "01:25",
    "seconds": 85,
    "speaker": "ESPN Commentator",
    "text": "the other horses, per se, in the race.",
    "isRecorded": true
  },
  {
    "time": "01:27",
    "seconds": 87,
    "speaker": "ESPN Commentator",
    "text": "And so watching just the highlights from last night, we were busy um with game plan stuff, but uh certainly it it proved to be an exciting game. Both",
    "isRecorded": true
  },
  {
    "time": "01:36",
    "seconds": 96,
    "speaker": "ESPN Commentator",
    "text": "defenses obviously played well and uh look the turnovers became a big deal especially uh you know when you look at that statistic in week one it's even",
    "isRecorded": true
  },
  {
    "time": "01:47",
    "seconds": 107,
    "speaker": "ESPN Commentator",
    "text": "it's even more magnified so um a good win for Seattle tough loss for New England and you know it gets things started >> and on we go. Lots of hope and optimism",
    "isRecorded": true
  },
  {
    "time": "01:57",
    "seconds": 117,
    "speaker": "ESPN Commentator",
    "text": "around this Broncos team. Bo Nick Knicks and his health of course was the big storyline heading into the season. How's he looked so far and where we at with",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "ESPN Commentator",
    "text": "your quarterback? Yeah, I why do I think that when this all laid out, the schedule, I think I think everyone felt strong about Nixon's health and even",
    "isRecorded": true
  },
  {
    "time": "02:13",
    "seconds": 133,
    "speaker": "ESPN Commentator",
    "text": "Patrick's health to their credit. Both those guys different injuries completely, but uh Bose's 100% um you know, he would have been cleared I'd say",
    "isRecorded": true
  },
  {
    "time": "02:24",
    "seconds": 144,
    "speaker": "ESPN Commentator",
    "text": "almost a month ago if we were playing.",
    "isRecorded": true
  },
  {
    "time": "02:26",
    "seconds": 146,
    "speaker": "ESPN Commentator",
    "text": "And um so it I think a lot of people were wondering, is he going to have that same mobility uh to move around? and we've seen it at practice. Um, he's in",
    "isRecorded": true
  },
  {
    "time": "02:36",
    "seconds": 156,
    "speaker": "ESPN Commentator",
    "text": "he's in good shape.",
    "isRecorded": true
  },
  {
    "time": "02:38",
    "seconds": 158,
    "speaker": "ESPN Commentator",
    "text": ">> Coach, I've got Steve Smith and Zack Z here on set with me. I'm going to start with Steve. Quiet player, never got into it with anyone on the Saints ever. Can",
    "isRecorded": true
  },
  {
    "time": "02:48",
    "seconds": 168,
    "speaker": "ESPN Commentator",
    "text": "you share your best Steve Smith story after a decade of coaching against this guy in the NFC South?",
    "isRecorded": true
  },
  {
    "time": "02:53",
    "seconds": 173,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah. Listen, um, so I don't know who you just described at the beginning.",
    "isRecorded": true
  },
  {
    "time": "02:57",
    "seconds": 177,
    "speaker": "ESPN Commentator",
    "text": "Quiet. Um, the thing that you admired about I admired about him is he was such a high high compete player and if he",
    "isRecorded": true
  },
  {
    "time": "03:08",
    "seconds": 188,
    "speaker": "ESPN Commentator",
    "text": "happened to be split towards our bench, all right, I don't care. It could have been the best corner in the history of the NFL, he would turn and just look at",
    "isRecorded": true
  },
  {
    "time": "03:17",
    "seconds": 197,
    "speaker": "ESPN Commentator",
    "text": "me and said, \"You're actually putting him on me.\" You know, and uh and so we would go back and forth. Obviously, it's an important game because it's a",
    "isRecorded": true
  },
  {
    "time": "03:26",
    "seconds": 206,
    "speaker": "ESPN Commentator",
    "text": "division game. you play him twice. Um, but my favorite story really that first year in 2006, uh, back when the Pro Bowl was in",
    "isRecorded": true
  },
  {
    "time": "03:37",
    "seconds": 217,
    "speaker": "ESPN Commentator",
    "text": "Hawaii, if if a team that lost the championship round, so the we lost to the Bears and the Patriots lost to the Colts. So, the Patriots staff was going",
    "isRecorded": true
  },
  {
    "time": "03:48",
    "seconds": 228,
    "speaker": "ESPN Commentator",
    "text": "to coach the AFC Pro Bowlers and then our staff, the Saints, coached the NFC Pro Bowlers. And Steve was in that Pro Bowl. Um, and so that was that was a",
    "isRecorded": true
  },
  {
    "time": "03:58",
    "seconds": 238,
    "speaker": "ESPN Commentator",
    "text": "legit game, especially when you got into the fourth quarter and there was money on the line. Um, so my memory serves me right. Breeze, the quarterbacks choose",
    "isRecorded": true
  },
  {
    "time": "04:09",
    "seconds": 249,
    "speaker": "ESPN Commentator",
    "text": "the order they're going. So this the quarterback who's the one Breeze, uh, he's going to take two or three series.",
    "isRecorded": true
  },
  {
    "time": "04:16",
    "seconds": 256,
    "speaker": "ESPN Commentator",
    "text": "I think Bulier was going to take maybe just a series or two. He had he had a little injury and Romo was making his first Pro Bowl debut. Steve",
    "isRecorded": true
  },
  {
    "time": "04:26",
    "seconds": 266,
    "speaker": "ESPN Commentator",
    "text": ">> as a firstear starter and so >> the early part of the game Breeze dislocates his left his left elbow.",
    "isRecorded": true
  },
  {
    "time": "04:37",
    "seconds": 277,
    "speaker": "ESPN Commentator",
    "text": ">> All right. So there's like all of a sudden, you know, as the head coach and your quarterback's literally out. Um, Bulgers's playing earlier, he's out and",
    "isRecorded": true
  },
  {
    "time": "04:45",
    "seconds": 285,
    "speaker": "ESPN Commentator",
    "text": "I'm telling you, Tony is in early second quarter >> and we go two quarters and Steve doesn't have a catch. And and I can see it and I",
    "isRecorded": true
  },
  {
    "time": "04:56",
    "seconds": 296,
    "speaker": "ESPN Commentator",
    "text": "can feel it on the sideline. I go over to Tony and I'm like, \"Hey man, we got to find a way like we got to throw a smoke to Ste. We got to throw the ball",
    "isRecorded": true
  },
  {
    "time": "05:04",
    "seconds": 304,
    "speaker": "ESPN Commentator",
    "text": "to Ste or else I think he's going to kill you before this game's over.\" And the problem with all of that is one of the smartest safeties and best free",
    "isRecorded": true
  },
  {
    "time": "05:16",
    "seconds": 316,
    "speaker": "ESPN Commentator",
    "text": "safeties to ever play our game is on the other sideline, Ed Reid. And Ed across the field is seeing this conflict between Romo and Smith. And so there's",
    "isRecorded": true
  },
  {
    "time": "05:26",
    "seconds": 326,
    "speaker": "ESPN Commentator",
    "text": "only so many coverages you're allowed to play in the Pro Bowl. And all of a sudden, what's supposed to be middle safety defense is middle safety cheat",
    "isRecorded": true
  },
  {
    "time": "05:34",
    "seconds": 334,
    "speaker": "ESPN Commentator",
    "text": "Steve because >> it sees that. Yeah. Yeah. And so I think Ed has an interception in that game. Um we managed to get Steve a couple throws,",
    "isRecorded": true
  },
  {
    "time": "05:44",
    "seconds": 344,
    "speaker": "ESPN Commentator",
    "text": "but uh but but I remember that that you know having a chance when you coach these players at the Pro Bowl, you really get to know them and there were a",
    "isRecorded": true
  },
  {
    "time": "05:54",
    "seconds": 354,
    "speaker": "ESPN Commentator",
    "text": "handful of Carolina players, players from our division and then around the the NFC. So um you you got great insight to the individuals, but man, I there's",
    "isRecorded": true
  },
  {
    "time": "06:04",
    "seconds": 364,
    "speaker": "ESPN Commentator",
    "text": "so many games. uh they all kind of run together, but it was the same back and forth. Um and that's that's the thing you knew you were getting with him is",
    "isRecorded": true
  },
  {
    "time": "06:14",
    "seconds": 374,
    "speaker": "ESPN Commentator",
    "text": "that grit, that toughness, that will to compete >> and but that that Pro Bowl experience uh that just chalks it up to Ed Reed's intelligence when he saw the Tony Romo",
    "isRecorded": true
  },
  {
    "time": "06:25",
    "seconds": 385,
    "speaker": "ESPN Commentator",
    "text": "as a quarterback.",
    "isRecorded": true
  },
  {
    "time": "06:27",
    "seconds": 387,
    "speaker": "ESPN Commentator",
    "text": ">> You know, now that I look back on it, um yeah, I could have been a little more.",
    "isRecorded": true
  },
  {
    "time": "06:33",
    "seconds": 393,
    "speaker": "ESPN Commentator",
    "text": ">> That's good. That was that was his first.",
    "isRecorded": true
  },
  {
    "time": "06:36",
    "seconds": 396,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah.",
    "isRecorded": true
  },
  {
    "time": "06:37",
    "seconds": 397,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah.",
    "isRecorded": true
  },
  {
    "time": "06:38",
    "seconds": 398,
    "speaker": "ESPN Commentator",
    "text": ">> Coach, >> that was his first pro bowl.",
    "isRecorded": true
  },
  {
    "time": "06:39",
    "seconds": 399,
    "speaker": "ESPN Commentator",
    "text": ">> We got Z here also. What do you got on Z? Anything from him?",
    "isRecorded": true
  },
  {
    "time": "06:43",
    "seconds": 403,
    "speaker": "ESPN Commentator",
    "text": ">> Well, normally like look the funny Zach story I have and Zach already knows the story before I'm going to tell it. I think it's 2014 and all the sports",
    "isRecorded": true
  },
  {
    "time": "06:53",
    "seconds": 413,
    "speaker": "ESPN Commentator",
    "text": "hernia surgeries are done by the same doctor generally in Philadelphia. U and and so I think was it Dr. Myers? Yes.",
    "isRecorded": true
  },
  {
    "time": "07:04",
    "seconds": 424,
    "speaker": "ESPN Commentator",
    "text": ">> Yes.",
    "isRecorded": true
  },
  {
    "time": "07:05",
    "seconds": 425,
    "speaker": "ESPN Commentator",
    "text": ">> Yes. That's it.",
    "isRecorded": true
  },
  {
    "time": "07:06",
    "seconds": 426,
    "speaker": "ESPN Commentator",
    "text": ">> All right. So, it's training camp and we're playing the Ravens. And right after that, I'm driving up to Philly to spend the night. I need I need to have a",
    "isRecorded": true
  },
  {
    "time": "07:15",
    "seconds": 435,
    "speaker": "ESPN Commentator",
    "text": "sports hern procedure done. This is back when I was CrossFit and doing all this crazy stuff the year I was suspended.",
    "isRecorded": true
  },
  {
    "time": "07:21",
    "seconds": 441,
    "speaker": "ESPN Commentator",
    "text": ">> And and I know it's bugging me, but it's it's going to be a day our players are off the next day. It's preseason. So, I'm first on the list at 7 a.m. And so,",
    "isRecorded": true
  },
  {
    "time": "07:32",
    "seconds": 452,
    "speaker": "ESPN Commentator",
    "text": "I'm there early and do the preop. I go in at 7 and it takes about a half an hour maybe. And I'm in recovery now. And they tell me that Zach is in the two",
    "isRecorded": true
  },
  {
    "time": "07:43",
    "seconds": 463,
    "speaker": "ESPN Commentator",
    "text": "spot. So, he's up at 7:30 and I know his We're in the recovery room. So, I want you to just picture like a mass unit where there's just",
    "isRecorded": true
  },
  {
    "time": "07:53",
    "seconds": 473,
    "speaker": "ESPN Commentator",
    "text": "sheets >> picturing Forest Gum. Yeah. Yeah. that whole scene.",
    "isRecorded": true
  },
  {
    "time": "07:57",
    "seconds": 477,
    "speaker": "ESPN Commentator",
    "text": ">> So, I know Z is in surgery. He comes out. He's in the bed next to me, but he can't see me.",
    "isRecorded": true
  },
  {
    "time": "08:03",
    "seconds": 483,
    "speaker": "ESPN Commentator",
    "text": ">> I don't remember any of this, by the way. I don't remember any of this.",
    "isRecorded": true
  },
  {
    "time": "08:06",
    "seconds": 486,
    "speaker": "ESPN Commentator",
    "text": ">> No, cuz you you you you were out of it.",
    "isRecorded": true
  },
  {
    "time": "08:09",
    "seconds": 489,
    "speaker": "ESPN Commentator",
    "text": "But I'm trying to figure out a way how do I mess with Z and uh and I know obviously he's playing with the Eagles at that time and so I'm kind of I'm now",
    "isRecorded": true
  },
  {
    "time": "08:18",
    "seconds": 498,
    "speaker": "ESPN Commentator",
    "text": "recovered and with it. He's still groggy, but he's just like whining over.",
    "isRecorded": true
  },
  {
    "time": "08:25",
    "seconds": 505,
    "speaker": "ESPN Commentator",
    "text": "I'm hearing he's whining at the nurse.",
    "isRecorded": true
  },
  {
    "time": "08:27",
    "seconds": 507,
    "speaker": "ESPN Commentator",
    "text": "He's whining and it keeps going and finally he he doesn't really know. I think he may know. And I'm like, \"Hey, Z, will you just shut the up?\"",
    "isRecorded": true
  },
  {
    "time": "08:38",
    "seconds": 518,
    "speaker": "ESPN Commentator",
    "text": "And and then I hear this pause. And then I hear, \"Coach, and I feel like after I shouted that,",
    "isRecorded": true
  },
  {
    "time": "08:48",
    "seconds": 528,
    "speaker": "ESPN Commentator",
    "text": "someone in his camp said, \"That's that's Coach Payton from the Saints.\" So, uh, I was just laughing because I knew he was coming too and and probably groggy",
    "isRecorded": true
  },
  {
    "time": "08:58",
    "seconds": 538,
    "speaker": "ESPN Commentator",
    "text": "thinking, \"Who's yelling at me in the recovery room after a sports hernia surgery?\" >> That's fantastic. I'm here for all the sports hernia stories you got, coach.",
    "isRecorded": true
  },
  {
    "time": "09:07",
    "seconds": 547,
    "speaker": "ESPN Commentator",
    "text": "Good luck on Monday. Tell Aman and Buck we say hello. Thanks so much for coming on, coach.",
    "isRecorded": true
  },
  {
    "time": "09:13",
    "seconds": 553,
    "speaker": "ESPN Commentator",
    "text": ">> Hey, congrats and appreciate it. Look forward to coming back.",
    "isRecorded": true
  },
  {
    "time": "09:16",
    "seconds": 556,
    "speaker": "ESPN Commentator",
    "text": ">> All right. Good luck Monday.",
    "isRecorded": true
  }
],
  "2eyWZKuBkEE": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "ESPN Commentator",
    "text": "Our hearts are so very heavy tonight at ESPN. News that we have been dreading arrived. Barry Melrose has passed away at the age of 70 after battling",
    "isRecorded": true
  },
  {
    "time": "00:09",
    "seconds": 9,
    "speaker": "ESPN Commentator",
    "text": "Parkinson's disease. It makes you catch your breath. Neil Ever closed every segment with Barry by saying, \"Cool is the rule because nobody was cooler than",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "ESPN Commentator",
    "text": "Barry.\" The hair, the suits, the laugh, the cigar. A cologne that I assume somebody somewhere made just for him. To hang out with coach talking hockey on",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "ESPN Commentator",
    "text": "the set or even better in one of our green rooms during the playoffs was a joy. And I say better off the air simply because not every story is meant to be",
    "isRecorded": true
  },
  {
    "time": "00:38",
    "seconds": 38,
    "speaker": "ESPN Commentator",
    "text": "shared with the world. But if you got to hear him, man, the stories were endless.",
    "isRecorded": true
  },
  {
    "time": "00:43",
    "seconds": 43,
    "speaker": "ESPN Commentator",
    "text": "From Saskatchewan on buses to LA coaching the great one, he grinded his way to the top and came oh so close to getting his name on the cup. It was",
    "isRecorded": true
  },
  {
    "time": "00:52",
    "seconds": 52,
    "speaker": "ESPN Commentator",
    "text": "gutting to fall a game short. I pray he knew and he had to know that his name is etched on the hearts of his ESPN teammates forever. This one is truly",
    "isRecorded": true
  },
  {
    "time": "01:04",
    "seconds": 64,
    "speaker": "ESPN Commentator",
    "text": "crushing. Jeremy Shap has more.",
    "isRecorded": true
  },
  {
    "time": "01:10",
    "seconds": 70,
    "speaker": "ESPN Commentator",
    "text": ">> In hockey there are legends [music] like Gordy How and Maurice Rishard. Wayne Gretzky to >> Gretzky.",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "ESPN Commentator",
    "text": "He did it. He did it. But the great players, all of them [music] are associated primarily with their teams.",
    "isRecorded": true
  },
  {
    "time": "01:26",
    "seconds": 86,
    "speaker": "ESPN Commentator",
    "text": "Barry Melrose was different.",
    "isRecorded": true
  },
  {
    "time": "01:29",
    "seconds": 89,
    "speaker": "ESPN Commentator",
    "text": ">> Hi, I'm Barry Melrose, the hardest working sports announcer in the world.",
    "isRecorded": true
  },
  {
    "time": "01:34",
    "seconds": 94,
    "speaker": "ESPN Commentator",
    "text": ">> He was bigger than any team. For decades, he suited up, and we mean suited up, for the [music] game, for the sport, for hockey.",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "ESPN Commentator",
    "text": ">> Look at the shoes, man.",
    "isRecorded": true
  },
  {
    "time": "01:44",
    "seconds": 104,
    "speaker": "ESPN Commentator",
    "text": ">> He belonged to everyone who loves the game. Belrose stood for everything that is good and great about hockey. One timer.",
    "isRecorded": true
  },
  {
    "time": "01:52",
    "seconds": 112,
    "speaker": "ESPN Commentator",
    "text": ">> When the girl doesn't call back.",
    "isRecorded": true
  },
  {
    "time": "01:54",
    "seconds": 114,
    "speaker": "ESPN Commentator",
    "text": ">> Oh yeah, I like that footer there.",
    "isRecorded": true
  },
  {
    "time": "01:57",
    "seconds": 117,
    "speaker": "ESPN Commentator",
    "text": ">> And as much as the game gave him, he gave back. When his illness, his Parkinsons became [music] public. There was an outpouring of love and support.",
    "isRecorded": true
  },
  {
    "time": "02:08",
    "seconds": 128,
    "speaker": "ESPN Commentator",
    "text": ">> Barry Melrose. Cool as a rule.",
    "isRecorded": true
  },
  {
    "time": "02:11",
    "seconds": 131,
    "speaker": "ESPN Commentator",
    "text": ">> Yes, without Barry Melrose, the game will go on, but it won't be as much fun.",
    "isRecorded": true
  },
  {
    "time": "02:19",
    "seconds": 139,
    "speaker": "ESPN Commentator",
    "text": "My heart's with his wife Cindy and all who love [music] Barry tonight, particularly his closest comrades here at ESPN. My brothers and his [music]",
    "isRecorded": true
  },
  {
    "time": "02:28",
    "seconds": 148,
    "speaker": "ESPN Commentator",
    "text": "John Butcher and Steve Levy. Brother Levy said it perfectly [music] tonight because it's true. Barry Melrose was the best of us.",
    "isRecorded": true
  }
],
  "b05P0ZzrIZc": [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "ESPN Commentator",
    "text": "Sam, I have been stalking you on social media and it looks like you have been having so much fun out here at the US Open. I was hoping since it's my first",
    "isRecorded": true
  },
  {
    "time": "00:08",
    "seconds": 8,
    "speaker": "ESPN Commentator",
    "text": "day here that you could take me around, show me what you've been up to, and help me check off some things on my bucket list.",
    "isRecorded": true
  },
  {
    "time": "00:13",
    "seconds": 13,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah. Are you kidding me? Let's do it.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "ESPN Commentator",
    "text": ">> Let's go.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "ESPN Commentator",
    "text": ">> Let's go.",
    "isRecorded": true
  },
  {
    "time": "00:21",
    "seconds": 21,
    "speaker": "ESPN Commentator",
    "text": ">> Samantha, one thing I really want to do, I want to walk the blue carpet.",
    "isRecorded": true
  },
  {
    "time": "00:25",
    "seconds": 25,
    "speaker": "ESPN Commentator",
    "text": ">> I think you should. There she is. Wow.",
    "isRecorded": true
  },
  {
    "time": "00:28",
    "seconds": 28,
    "speaker": "ESPN Commentator",
    "text": "We've been waiting for you. Cute.",
    "isRecorded": true
  },
  {
    "time": "00:31",
    "seconds": 31,
    "speaker": "ESPN Commentator",
    "text": ">> This looks a lot like football turf. So, I I feel very close to home.",
    "isRecorded": true
  },
  {
    "time": "00:37",
    "seconds": 37,
    "speaker": "ESPN Commentator",
    "text": ">> But, can you buy a Honeydew shirt before you get a Honeydew drink?",
    "isRecorded": true
  },
  {
    "time": "00:41",
    "seconds": 41,
    "speaker": "ESPN Commentator",
    "text": ">> Ooh, good question.",
    "isRecorded": true
  },
  {
    "time": "00:42",
    "seconds": 42,
    "speaker": "ESPN Commentator",
    "text": ">> An age-old question. Smells like money. What do you think?",
    "isRecorded": true
  },
  {
    "time": "00:48",
    "seconds": 48,
    "speaker": "ESPN Commentator",
    "text": ">> It's perfect. You have to get it.",
    "isRecorded": true
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "ESPN Commentator",
    "text": ">> You know, I really want to interview an Olympic gold medalist. Do you think there's any around here? Well, yesterday was my first time and I've watched",
    "isRecorded": true
  },
  {
    "time": "00:59",
    "seconds": 59,
    "speaker": "ESPN Commentator",
    "text": "historically from my couch at my house and this is a dream come true to be able to watch these athletes. The fact that it has Billy Jean King's name right on",
    "isRecorded": true
  },
  {
    "time": "01:09",
    "seconds": 69,
    "speaker": "ESPN Commentator",
    "text": "it is also a blessing and I'm just thrilled to be here.",
    "isRecorded": true
  },
  {
    "time": "01:13",
    "seconds": 73,
    "speaker": "ESPN Commentator",
    "text": ">> What first timer things did you do? Did you have a honeydeuce for the first time?",
    "isRecorded": true
  },
  {
    "time": "01:19",
    "seconds": 79,
    "speaker": "ESPN Commentator",
    "text": ">> The answer is yes, I did. I tried it. I loved it actually. It was quite good.",
    "isRecorded": true
  },
  {
    "time": "01:24",
    "seconds": 84,
    "speaker": "ESPN Commentator",
    "text": "And it doesn't matter from where you come from around the world. Uh sports unites us and it's wonderful that we can all be here.",
    "isRecorded": true
  },
  {
    "time": "01:31",
    "seconds": 91,
    "speaker": "ESPN Commentator",
    "text": ">> That was so cool.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "ESPN Commentator",
    "text": ">> You know, I think I want to cheer on a former US Open champion.",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "ESPN Commentator",
    "text": ">> You know what? I think I know the perfect person to do just that.",
    "isRecorded": true
  },
  {
    "time": "01:40",
    "seconds": 100,
    "speaker": "ESPN Commentator",
    "text": ">> Knock them down. Turn around. Come on.",
    "isRecorded": true
  },
  {
    "time": "01:43",
    "seconds": 103,
    "speaker": "ESPN Commentator",
    "text": "Coco work.",
    "isRecorded": true
  },
  {
    "time": "01:44",
    "seconds": 104,
    "speaker": "ESPN Commentator",
    "text": ">> I have to know how did this come together? How did you come up with this cheer?",
    "isRecorded": true
  },
  {
    "time": "01:47",
    "seconds": 107,
    "speaker": "ESPN Commentator",
    "text": ">> It's from the movie Bring It On that they do their chair, knock them down, turn around, come on. Toro's work. And I replaced Tauros the Toros I replaced it",
    "isRecorded": true
  },
  {
    "time": "01:56",
    "seconds": 116,
    "speaker": "ESPN Commentator",
    "text": "with Coco. This year will mark my fourth year working here. So I think this is the year where I've just actually went out loud and I actually did it and she",
    "isRecorded": true
  },
  {
    "time": "02:04",
    "seconds": 124,
    "speaker": "ESPN Commentator",
    "text": "actually like recuperated back like it was just so I was just so starruck and I'm just like if I could give a little bit of like sunshine or just the fact",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "ESPN Commentator",
    "text": "that hey like you know somebody's cheering you on and it's going to be okay, I'm more more than happy to do it.",
    "isRecorded": true
  },
  {
    "time": "02:21",
    "seconds": 141,
    "speaker": "ESPN Commentator",
    "text": "Um, can I do two honey deuces?",
    "isRecorded": true
  },
  {
    "time": "02:28",
    "seconds": 148,
    "speaker": "ESPN Commentator",
    "text": ">> All right, Brooke, we got our honey deuces. I think the last thing we have to do naturally, catch a match. We got to",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "ESPN Commentator",
    "text": ">> the world number one stretched to the limit in New York. Who returns once more to the last four.",
    "isRecorded": true
  }
],
  "kA55F82Dqvs": [
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "ESPN Commentator",
    "text": "Hello beautiful people and welcome to our humble the boat the draft kings thunderdown on this D on the football September 10th 2026 this sports program",
    "isRecorded": true
  },
  {
    "time": "00:20",
    "seconds": 20,
    "speaker": "ESPN Commentator",
    "text": "begins now >> FOOTBALL >> IS fantastic not bad for an old lad ladies and gentlemen joining us live in the thunder underdom once again after a",
    "isRecorded": true
  },
  {
    "time": "00:31",
    "seconds": 31,
    "speaker": "ESPN Commentator",
    "text": "year of coaching for a team in which he's no longer coaching for a guy who coached in the NFL for 19 years, college for 18 years, was uh my head coach when",
    "isRecorded": true
  },
  {
    "time": "00:41",
    "seconds": 41,
    "speaker": "ESPN Commentator",
    "text": "I was at the Indianapolis Colts, a gentleman, a scholar, a friend of the program, ladies and gentlemen. Welcome back, Coach Pagano.",
    "isRecorded": true
  },
  {
    "time": "00:51",
    "seconds": 51,
    "speaker": "ESPN Commentator",
    "text": ">> Good to see you, Coach B. The talks and tables here at Boston Connor and at Tai Schmidt con man. We're certainly going to dive into a lot about you. One half",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "ESPN Commentator",
    "text": "of the hammer done. Cowboys AP Tony is here. Drake May in his last couple games has more turnovers than he had in the first season in which he played. Drake",
    "isRecorded": true
  },
  {
    "time": "01:05",
    "seconds": 65,
    "speaker": "ESPN Commentator",
    "text": "May was seeing a little bit of ghost maybe in the fourth quarter or was he just trying to force some things were some things maybe not his fault and that",
    "isRecorded": true
  },
  {
    "time": "01:12",
    "seconds": 72,
    "speaker": "ESPN Commentator",
    "text": "ended up obviously being put on his stats. Three picks in the fourth quarter including this game losing pick right here at the very end of the game. Now we",
    "isRecorded": true
  },
  {
    "time": "01:20",
    "seconds": 80,
    "speaker": "ESPN Commentator",
    "text": "can look at this play from the all 22 angle and uh I think we should do that.",
    "isRecorded": true
  },
  {
    "time": "01:24",
    "seconds": 84,
    "speaker": "ESPN Commentator",
    "text": "Maybe it's not just 100% Drake May. Now granted cannot be throwing the ball to the other team in field goal range under a minute left in the game down a field",
    "isRecorded": true
  },
  {
    "time": "01:34",
    "seconds": 94,
    "speaker": "ESPN Commentator",
    "text": "goal as a starting quarterback that's been in MVP finding those conversations.",
    "isRecorded": true
  },
  {
    "time": "01:37",
    "seconds": 97,
    "speaker": "ESPN Commentator",
    "text": "And what I think we know about the Seattle Seahawks team after watching them just for one game, their culture has been established. They fly around.",
    "isRecorded": true
  },
  {
    "time": "01:43",
    "seconds": 103,
    "speaker": "ESPN Commentator",
    "text": "They play hard. They're obviously going to be sound. They're not scared to get into a grimy football game. And John Schneider, who will be joining us at",
    "isRecorded": true
  },
  {
    "time": "01:49",
    "seconds": 109,
    "speaker": "ESPN Commentator",
    "text": "110, he built this team very well. has a backup quarterback ready to go in there and perform opening night if you need it with a brand new play caller. I like",
    "isRecorded": true
  },
  {
    "time": "01:57",
    "seconds": 117,
    "speaker": "ESPN Commentator",
    "text": "where the Seahawks sit, but I'm not exactly all the way out on Drake May like everybody else is because it seems like this is potentially fixable, con",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "ESPN Commentator",
    "text": "man.",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah, definitely fixable. It felt like he got bored. You know, you mentioned all three of those picks were in the fourth quarter. It felt like he was okay",
    "isRecorded": true
  },
  {
    "time": "02:08",
    "seconds": 128,
    "speaker": "ESPN Commentator",
    "text": "with those checkdowns only for so long.",
    "isRecorded": true
  },
  {
    "time": "02:11",
    "seconds": 131,
    "speaker": "ESPN Commentator",
    "text": "Even that first unbelievable interception here, it is second down.",
    "isRecorded": true
  },
  {
    "time": "02:14",
    "seconds": 134,
    "speaker": "ESPN Commentator",
    "text": "You know, maybe you don't have to chuck it. If it's third down, you could kind of rule this as a punt. Hey, whatever.",
    "isRecorded": true
  },
  {
    "time": "02:19",
    "seconds": 139,
    "speaker": "ESPN Commentator",
    "text": "He was just kind of throwing it up there. Maybe Romeo Dobs makes a play.",
    "isRecorded": true
  },
  {
    "time": "02:22",
    "seconds": 142,
    "speaker": "ESPN Commentator",
    "text": "It's second down, so not a great decision, but still can live with it.",
    "isRecorded": true
  },
  {
    "time": "02:25",
    "seconds": 145,
    "speaker": "ESPN Commentator",
    "text": "And especially with Romeo Dobs, hadn't really made many plays. Hadn't had many targets. That might have been his first target of the entire game, and it's in",
    "isRecorded": true
  },
  {
    "time": "02:33",
    "seconds": 153,
    "speaker": "ESPN Commentator",
    "text": "the fourth quarter, so that one's tough.",
    "isRecorded": true
  },
  {
    "time": "02:34",
    "seconds": 154,
    "speaker": "ESPN Commentator",
    "text": "But the things that we were most worried about kind of showed up like the offensive line not that bad. The front seven for Seattle, it's the best in the",
    "isRecorded": true
  },
  {
    "time": "02:42",
    "seconds": 162,
    "speaker": "ESPN Commentator",
    "text": "league. They're going to do this to a lot of teams. Mike McDonald is going to do this to a lot of quarterbacks, make a lot of guys look bad. But for the",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "ESPN Commentator",
    "text": "decision-making at the end, I mean, it's the worst throw of Drake May's career. I think he would even agree with that.",
    "isRecorded": true
  },
  {
    "time": "02:55",
    "seconds": 175,
    "speaker": "ESPN Commentator",
    "text": "Probably the worst decision of his career. You know, the cup block, you guys mentioned how he was going trying to go outside. Morgan Moses, the right",
    "isRecorded": true
  },
  {
    "time": "03:01",
    "seconds": 181,
    "speaker": "ESPN Commentator",
    "text": "tackle, got none of Demarcus Lawrence.",
    "isRecorded": true
  },
  {
    "time": "03:03",
    "seconds": 183,
    "speaker": "ESPN Commentator",
    "text": "So maybe he couldn't even see Hunter Henry through Demarcus Lawrence in that entire thing. Maybe that ball gets batted. Either way, you just can't throw",
    "isRecorded": true
  },
  {
    "time": "03:10",
    "seconds": 190,
    "speaker": "ESPN Commentator",
    "text": "it that deep. It did feel like the defense was the defense. Drew Lock. Yes, he's a backup quarterback, but got he got every single rep in the preseason.",
    "isRecorded": true
  },
  {
    "time": "03:18",
    "seconds": 198,
    "speaker": "ESPN Commentator",
    "text": "So, we talk about these early games being kind of like preseason games for the starters because of the fact that they don't play any in the preseason",
    "isRecorded": true
  },
  {
    "time": "03:25",
    "seconds": 205,
    "speaker": "ESPN Commentator",
    "text": "anymore. Drew Lock coming in. He's experienced. He's an eight-year guy. He knows how to play, but not not all terrible. Should have had it. You know,",
    "isRecorded": true
  },
  {
    "time": "03:32",
    "seconds": 212,
    "speaker": "ESPN Commentator",
    "text": "you got to win those ones, especially on the road. Best truck down the line. Ram trucks. Listen, if you want to ride on clouds >> Oh. and pull anything and feel that",
    "isRecorded": true
  },
  {
    "time": "03:42",
    "seconds": 222,
    "speaker": "ESPN Commentator",
    "text": "power underneath you whenever you're driving. You get yourself a Ram truck.",
    "isRecorded": true
  },
  {
    "time": "03:46",
    "seconds": 226,
    "speaker": "ESPN Commentator",
    "text": "What's it sound like whenever you hit that gas pedal again? [laughter] Joining us now is a man who crew all the news and inside information",
    "isRecorded": true
  },
  {
    "time": "03:58",
    "seconds": 238,
    "speaker": "ESPN Commentator",
    "text": "of the NFL. Senior NFL insider for ESPN.",
    "isRecorded": true
  },
  {
    "time": "04:00",
    "seconds": 240,
    "speaker": "ESPN Commentator",
    "text": "Adam Sher's back.",
    "isRecorded": true
  },
  {
    "time": "04:02",
    "seconds": 242,
    "speaker": "ESPN Commentator",
    "text": ">> Hopefully this connection is better.",
    "isRecorded": true
  },
  {
    "time": "04:03",
    "seconds": 243,
    "speaker": "ESPN Commentator",
    "text": "Hopefully this connection is better.",
    "isRecorded": true
  },
  {
    "time": "04:04",
    "seconds": 244,
    "speaker": "ESPN Commentator",
    "text": "Different phone.",
    "isRecorded": true
  },
  {
    "time": "04:05",
    "seconds": 245,
    "speaker": "ESPN Commentator",
    "text": ">> It already sounds better. You already look better, which is tough to do because of how fantastic you obviously always look. Okay, so Sam Darnold going",
    "isRecorded": true
  },
  {
    "time": "04:12",
    "seconds": 252,
    "speaker": "ESPN Commentator",
    "text": "through the scan. Doctor's reading it now. We dodged a bullet, probably out a couple weeks, but probably not forever.",
    "isRecorded": true
  },
  {
    "time": "04:16",
    "seconds": 256,
    "speaker": "ESPN Commentator",
    "text": "Okay, let's go over the New England Patriots side. AJ Brown, sprained ankle, is that what we're assuming? Have we gotten any information out of that?",
    "isRecorded": true
  },
  {
    "time": "04:22",
    "seconds": 262,
    "speaker": "ESPN Commentator",
    "text": "Because obviously high price target this off season. Doesn't have a lot of impact in the game and ends in a walking boot.",
    "isRecorded": true
  },
  {
    "time": "04:28",
    "seconds": 268,
    "speaker": "ESPN Commentator",
    "text": "Can you tell us a little bit about what we know about AJ? Right now, NFL Network Junior and Mike Gerafo said it's a high ankle sprain, which again, we knew, you",
    "isRecorded": true
  },
  {
    "time": "04:37",
    "seconds": 277,
    "speaker": "ESPN Commentator",
    "text": "knew when he went down there was some type of ankle sprain. Not a surprise to see it looks like a high ankle sprain.",
    "isRecorded": true
  },
  {
    "time": "04:42",
    "seconds": 282,
    "speaker": "ESPN Commentator",
    "text": "He's going to have more testing there today. They want to see how long he'll be out. I guess they want to see if there's any kind of fracture there.",
    "isRecorded": true
  },
  {
    "time": "04:49",
    "seconds": 289,
    "speaker": "ESPN Commentator",
    "text": "Hopefully not for his sake. Um, limped off the field there last night, went to the locker room. We'll see how long he's going to be out, but that's going to be",
    "isRecorded": true
  },
  {
    "time": "04:58",
    "seconds": 298,
    "speaker": "ESPN Commentator",
    "text": "probably a multiple week injury in all probability.",
    "isRecorded": true
  },
  {
    "time": "05:00",
    "seconds": 300,
    "speaker": "ESPN Commentator",
    "text": ">> Traded for or got the uh Super Bowl MVP.",
    "isRecorded": true
  },
  {
    "time": "05:04",
    "seconds": 304,
    "speaker": "ESPN Commentator",
    "text": "Kenny, they call him K9. Kenneth Walker.",
    "isRecorded": true
  },
  {
    "time": "05:06",
    "seconds": 306,
    "speaker": "ESPN Commentator",
    "text": "Whole boatload of him.",
    "isRecorded": true
  },
  {
    "time": "05:07",
    "seconds": 307,
    "speaker": "ESPN Commentator",
    "text": ">> You think we're going to be running the ball a lot there potentially. Joining us now is an undrafted offensive lineman out of Duke. Played 10 years in the NFL.",
    "isRecorded": true
  },
  {
    "time": "05:14",
    "seconds": 314,
    "speaker": "ESPN Commentator",
    "text": "Seen him on the internet, seen him on TV, quickly becoming one of our favorite people, ladies and gentlemen, Brian Baldinger.",
    "isRecorded": true
  },
  {
    "time": "05:20",
    "seconds": 320,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah, >> Baldi. Perfect.",
    "isRecorded": true
  },
  {
    "time": "05:23",
    "seconds": 323,
    "speaker": "ESPN Commentator",
    "text": ">> Back. Good to be with you here, man.",
    "isRecorded": true
  },
  {
    "time": "05:24",
    "seconds": 324,
    "speaker": "ESPN Commentator",
    "text": "Good to see you here.",
    "isRecorded": true
  },
  {
    "time": "05:25",
    "seconds": 325,
    "speaker": "ESPN Commentator",
    "text": ">> Hey, great to see you. Love the energy.",
    "isRecorded": true
  },
  {
    "time": "05:27",
    "seconds": 327,
    "speaker": "ESPN Commentator",
    "text": "Perfect timing for you to join us with the conversation about the left tackle being an undrafted guy out of IU for Patrick Mahomes to lead the season.",
    "isRecorded": true
  },
  {
    "time": "05:33",
    "seconds": 333,
    "speaker": "ESPN Commentator",
    "text": "Obviously not desirable position for the Kansas City Chiefs. Your thoughts on Patrick Mahomes coming back with how that could potentially affect literally",
    "isRecorded": true
  },
  {
    "time": "05:40",
    "seconds": 340,
    "speaker": "ESPN Commentator",
    "text": "everything.",
    "isRecorded": true
  },
  {
    "time": "05:42",
    "seconds": 342,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah, you know, I I saw Khalil Benson in training camp out in St. Joseph's, Missouri. He was competing for the right tackle job with Jaylen Moore, and I",
    "isRecorded": true
  },
  {
    "time": "05:50",
    "seconds": 350,
    "speaker": "ESPN Commentator",
    "text": "thought he was the front runner to win that job. And then Trey Smith, he went down to training camp. Khil Benson went into right guard. He started the game at",
    "isRecorded": true
  },
  {
    "time": "05:57",
    "seconds": 357,
    "speaker": "ESPN Commentator",
    "text": "right guard in preeason. Now he's out at left tackle. So he's been bouncing around uh Kansas City here along the offensive line. But they need to put",
    "isRecorded": true
  },
  {
    "time": "06:06",
    "seconds": 366,
    "speaker": "ESPN Commentator",
    "text": "their best five out there. And Khalil Benson has proven at least in preeason up against what Spags is putting out there in training camp that he's held up",
    "isRecorded": true
  },
  {
    "time": "06:16",
    "seconds": 376,
    "speaker": "ESPN Commentator",
    "text": "pretty good. And you know, you come out of Indiana and you play 15 games at at Indiana, win the national championship.",
    "isRecorded": true
  },
  {
    "time": "06:22",
    "seconds": 382,
    "speaker": "ESPN Commentator",
    "text": "He got tested got tested against Miami in that, you know, that championship game. And he he looked pretty good uh in that last game in the championship.",
    "isRecorded": true
  },
  {
    "time": "06:30",
    "seconds": 390,
    "speaker": "ESPN Commentator",
    "text": ">> Joining us now is a man that pieced it together. When it's all said and done, he's going to have to be chatted about as one of the greatest general managers",
    "isRecorded": true
  },
  {
    "time": "06:35",
    "seconds": 395,
    "speaker": "ESPN Commentator",
    "text": "to ever build a team, two teams in the NFL. We got a chance to hang around him.",
    "isRecorded": true
  },
  {
    "time": "06:42",
    "seconds": 402,
    "speaker": "ESPN Commentator",
    "text": "Hilarious individual, >> man.",
    "isRecorded": true
  },
  {
    "time": "06:43",
    "seconds": 403,
    "speaker": "ESPN Commentator",
    "text": ">> Hard knocks. We see he's an incredible leader of a franchise and obviously the proof is in the pudding. They're a damn good football team even if they lose",
    "isRecorded": true
  },
  {
    "time": "06:52",
    "seconds": 412,
    "speaker": "ESPN Commentator",
    "text": "their franchise quarterback just four plays in. Ladies and gentlemen, joining us now bright and early. Good morning sunshine. General manager of the Seattle",
    "isRecorded": true
  },
  {
    "time": "07:00",
    "seconds": 420,
    "speaker": "ESPN Commentator",
    "text": "Seahawks, John Schneider.",
    "isRecorded": true
  },
  {
    "time": "07:03",
    "seconds": 423,
    "speaker": "ESPN Commentator",
    "text": ">> How you doing, brother?",
    "isRecorded": true
  },
  {
    "time": "07:05",
    "seconds": 425,
    "speaker": "ESPN Commentator",
    "text": ">> Yeah, a little early fellas, huh?",
    "isRecorded": true
  },
  {
    "time": "07:07",
    "seconds": 427,
    "speaker": "ESPN Commentator",
    "text": ">> What are the types of players you think that fit into your team and why do you think those are the types of players that fit into your team?",
    "isRecorded": true
  },
  {
    "time": "07:15",
    "seconds": 435,
    "speaker": "ESPN Commentator",
    "text": "Well, I say getting back to Mike, I think, you know, to to to uh finish that thought, it's it's very hard to to come in and replace an iconic guy like Pete,",
    "isRecorded": true
  },
  {
    "time": "07:24",
    "seconds": 444,
    "speaker": "ESPN Commentator",
    "text": "like Coach Carol's like, you know, you guys know this, it's it's it's a really he's a very strong presence. And uh we did a lot of awesome stuff here",
    "isRecorded": true
  },
  {
    "time": "07:34",
    "seconds": 454,
    "speaker": "ESPN Commentator",
    "text": "together. And for him to come in now, it really feels like for Mike to come in, it really feels like, okay, these are his guys.",
    "isRecorded": true
  },
  {
    "time": "07:42",
    "seconds": 462,
    "speaker": "ESPN Commentator",
    "text": "this is his team and that takes a minute, you know, and and uh you know, his first season he did an awesome job the 10 wins and then but understanding",
    "isRecorded": true
  },
  {
    "time": "07:53",
    "seconds": 473,
    "speaker": "ESPN Commentator",
    "text": "like hey I want to make this a more connected team. I want to, you know, that his his uh his self scouting was like impeccable and what he wanted, the",
    "isRecorded": true
  },
  {
    "time": "08:02",
    "seconds": 482,
    "speaker": "ESPN Commentator",
    "text": "clarity of it, and we worked hard at it.",
    "isRecorded": true
  },
  {
    "time": "08:05",
    "seconds": 485,
    "speaker": "ESPN Commentator",
    "text": "And so bringing the guys together, the the second part of that with what we're looking for, we've always had, excuse [clears throat] me, we've always",
    "isRecorded": true
  },
  {
    "time": "08:12",
    "seconds": 492,
    "speaker": "ESPN Commentator",
    "text": "had our grit scale. We've always had our competitor scale. Uh what have you been through? What have you overcome? Are you a good teammate? Do you love ball? Um do",
    "isRecorded": true
  },
  {
    "time": "08:22",
    "seconds": 502,
    "speaker": "ESPN Commentator",
    "text": "you want to be great? Do you want to just be a guy and like get through and get your next contract or do you want to be you want to be like you said like you",
    "isRecorded": true
  },
  {
    "time": "08:27",
    "seconds": 507,
    "speaker": "ESPN Commentator",
    "text": "want to be a dog?",
    "isRecorded": true
  },
  {
    "time": "08:28",
    "seconds": 508,
    "speaker": "ESPN Commentator",
    "text": ">> You look at the tail of the tape. It's just green on the right side.",
    "isRecorded": true
  },
  {
    "time": "08:32",
    "seconds": 512,
    "speaker": "ESPN Commentator",
    "text": ">> D [snorts] has a key match up basically.",
    "isRecorded": true
  },
  {
    "time": "08:35",
    "seconds": 515,
    "speaker": "ESPN Commentator",
    "text": "Chuck, who are you picking to win tonight with all that being said?",
    "isRecorded": true
  },
  {
    "time": "08:37",
    "seconds": 517,
    "speaker": "ESPN Commentator",
    "text": ">> Even Red Road on offense, he doesn't even have the green on the San Fran side. He just wants to be less green on their side.",
    "isRecorded": true
  },
  {
    "time": "08:44",
    "seconds": 524,
    "speaker": "ESPN Commentator",
    "text": ">> Well, that's awesome. That does seem like that is maybe a mistake that was made there. No winners there. Kind of call it a tossup is what he's saying.",
    "isRecorded": true
  },
  {
    "time": "08:50",
    "seconds": 530,
    "speaker": "ESPN Commentator",
    "text": "So, with all that being said, we got what, 12 stats here. We had six key matchups. Uh, the Rams have been in a landslide dominant position for all your",
    "isRecorded": true
  },
  {
    "time": "09:00",
    "seconds": 540,
    "speaker": "ESPN Commentator",
    "text": "graphics thus far. Do you pick them to win tonight by at least three and a half, sir?",
    "isRecorded": true
  },
  {
    "time": "09:05",
    "seconds": 545,
    "speaker": "ESPN Commentator",
    "text": ">> I know this will shock you and our viewers.",
    "isRecorded": true
  },
  {
    "time": "09:09",
    "seconds": 549,
    "speaker": "ESPN Commentator",
    "text": ">> I'm going [snorts] with the Rams.",
    "isRecorded": true
  },
  {
    "time": "09:10",
    "seconds": 550,
    "speaker": "ESPN Commentator",
    "text": "They're going to they're going to beat the 49ers in Australia down under. Get their ass back home. Have a mini buy.",
    "isRecorded": true
  },
  {
    "time": "09:17",
    "seconds": 557,
    "speaker": "ESPN Commentator",
    "text": "All right. 28-20. Rams >> 28-20 Rams.",
    "isRecorded": true
  },
  {
    "time": "09:21",
    "seconds": 561,
    "speaker": "ESPN Commentator",
    "text": ">> All right. Four Tuds.",
    "isRecorded": true
  },
  {
    "time": "09:22",
    "seconds": 562,
    "speaker": "ESPN Commentator",
    "text": ">> Okay. I like that there's a lot of points being scored here for the Australians to come watch our sport. Do you think it's KG affair early like last",
    "isRecorded": true
  },
  {
    "time": "09:27",
    "seconds": 567,
    "speaker": "ESPN Commentator",
    "text": "night? Super KY last night, but obviously incredible defense.",
    "isRecorded": true
  },
  {
    "time": "09:30",
    "seconds": 570,
    "speaker": "ESPN Commentator",
    "text": ">> No, there's going to be a filling out.",
    "isRecorded": true
  },
  {
    "time": "09:31",
    "seconds": 571,
    "speaker": "ESPN Commentator",
    "text": "There's going to be a bunch of sparring early in this one. But to play, don't care who makes it.",
    "isRecorded": true
  },
  {
    "time": "09:36",
    "seconds": 576,
    "speaker": "ESPN Commentator",
    "text": ">> That's right.",
    "isRecorded": true
  },
  {
    "time": "09:36",
    "seconds": 576,
    "speaker": "ESPN Commentator",
    "text": ">> It's true.",
    "isRecorded": true
  },
  {
    "time": "09:37",
    "seconds": 577,
    "speaker": "ESPN Commentator",
    "text": ">> Hey, six seconds all you got for as many as we need.",
    "isRecorded": true
  },
  {
    "time": "09:40",
    "seconds": 580,
    "speaker": "ESPN Commentator",
    "text": ">> Don't look up. IT'S A BIG DAY WITH BIG SHREDS. Nailed it.",
    "isRecorded": true
  },
  {
    "time": "09:44",
    "seconds": 584,
    "speaker": "ESPN Commentator",
    "text": ">> Perfect.",
    "isRecorded": true
  },
  {
    "time": "09:46",
    "seconds": 586,
    "speaker": "ESPN Commentator",
    "text": ">> Boom.",
    "isRecorded": true
  },
  {
    "time": "09:46",
    "seconds": 586,
    "speaker": "ESPN Commentator",
    "text": ">> Boom. for Peter Shreger. Y >> going since Monday.",
    "isRecorded": true
  },
  {
    "time": "09:50",
    "seconds": 590,
    "speaker": "ESPN Commentator",
    "text": ">> No, it starts today. Actually, three minutes ago.",
    "isRecorded": true
  },
  {
    "time": "09:52",
    "seconds": 592,
    "speaker": "ESPN Commentator",
    "text": ">> Day one. Okay.",
    "isRecorded": true
  },
  {
    "time": "09:53",
    "seconds": 593,
    "speaker": "ESPN Commentator",
    "text": ">> It's a big day for big >> on a mic talking big plays. Yeah, there it is. There it is. We found it. Okay. I didn't know if we were going to be able",
    "isRecorded": true
  },
  {
    "time": "10:02",
    "seconds": 602,
    "speaker": "ESPN Commentator",
    "text": "to get to it ever, but it's a big day >> with big",
    "isRecorded": true
  }
],
};

export function getLocalTranscript(videoId: string): TranscriptSegment[] | null {
  if (!videoId) return null;
  const raw = STATIC_TRANSCRIPTS[videoId];
  if (!raw) return null;
  return raw.map(s => ({ ...s, isRecorded: true } as any));
}
