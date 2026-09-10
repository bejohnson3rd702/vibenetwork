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
};

export function getLocalTranscript(videoId: string): TranscriptSegment[] | null {
  if (!videoId) return null;
  const raw = STATIC_TRANSCRIPTS[videoId];
  if (!raw) return null;
  return raw.map(s => ({ ...s, isRecorded: true } as any));
}
