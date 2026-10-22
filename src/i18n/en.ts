import type { ContentPack } from './types';

/* ------------------------------------------------------------------
   English content pack — translated from the Korean source in src/data.
   Facts (prices, times, numbers) follow the original exactly.
------------------------------------------------------------------- */

export const EN: ContentPack = {
  /* ---------------------------------------------------------------- site */
  site: {
    brand: 'Jejulog',
    brandEn: 'JEJULOG',
    issue: 'VOL. 01 — JEJU GUESTHOUSE',
    description:
      'Jeju guesthouses, we thought, were all about parties. Here are nine experiences our editors found by staying in person — and the stay that suits you.',

    intro: {
      slug: 'S#00. GUESTHOUSE / NIGHT',
      time: '23:40',
      question: 'What words come to mind\nwhen you hear “guesthouse”?',
      words: ['Parties', 'Drinks', 'Flirting'],
      turn: 'The guesthouse you know\nisn’t the whole story.',
    },

    problem: {
      label: 'PROBLEM',
      title: ['Guesthouses — do parties still come to mind first?'],
      points: [
        {
          no: '01',
          key: 'How we choose',
          text: 'When choosing a stay, we mostly compare price and location. But a guesthouse isn’t just a place to sleep — you can enjoy all kinds of activities and connect with new people.',
        },
      ],
      answer: 'Now it’s time to look beyond price and location\nand choose a guesthouse by the experience you want.',
      answerNote: '',
    },

    checkIn: {
      label: 'CHECK IN',
      title: ['Beyond the door,', 'the guesthouse we never knew.'],
      sub: 'Open the door\nand discover your taste.',
      cta: 'Open the door and check in',
    },

    findYourStay: {
      label: 'FIND YOUR STAY',
      title: ['Find the Jeju guesthouse', 'that fits your taste.'],
      cta: 'Find my guesthouse',
    },

    checkOut: {
      label: 'CHECK OUT',
      title: ['Do you see it differently', 'now than when you came in?'],
      sub: 'Beyond parties, guesthouses hold\nall kinds of experiences\nwaiting to match your taste.',
      cta: 'Look around again',
      closing: 'We hope the way you choose a stay shifts\nfrom price and location to the experience you want.\nMay your next Jeju trip be remembered by your taste.',
    },

    explore: {
      label: 'EXPLORE',
      title: ['Here,', 'what would you like to experience?'],
      sub: 'Explore nine experiences waiting at Jeju guesthouses.',
      hint: 'Tap a room to visit its guesthouse.',
    },
    characters: {
      cinema: 'Stay for the end credits',
      lp: 'Put the earphones away for a while',
      book: 'Be honest, just for tonight',
      craft: 'Carve your worries away',
      flower: 'Today is all about me',
      homemeal: 'Let’s have dinner together',
      wine: 'Fill up my glass',
      running: 'One more lap',
      camping: 'Keep this moment just as it is',
    },
  },

  /* --------------------------------------------------------- experiences */
  experiences: {
    book: { label: 'Reading', short: 'Books' },
    lp: { label: 'Vinyl', short: 'LP' },
    craft: { label: 'Wood Rings', short: 'Rings' },
    camping: { label: 'Snapshots', short: 'Snaps', headline: 'How to Capture Jeju’s Seasons in Photos' },
    cinema: { label: 'Cinema', short: 'Cinema' },
    homemeal: { label: 'Home Meals', short: 'Meals', headline: 'How to Find a Warm Home-Cooked Meal in an Unfamiliar Jeju' },
    flower: { label: 'Flowers', short: 'Flowers' },
    running: { label: 'Running', short: 'Running' },
    wine: { label: 'Wine', short: 'Wine' },
  },

  floors: {
    attic: 'Attic Studio',
    study: 'Study',
    living: 'Living Room',
    kitchen: 'Kitchen',
    yard: 'Yard',
  },

  /* ------------------------------------------------------------ programs */
  programs: {
    running: {
      title: 'How to Run Along Jeju’s Sea',
      kicker: 'Next on the schedule after check-in: lacing up your running shoes.',
      intro:
        'So that even solo travelers in Jeju can easily mix with strangers, the house offers an evening dinner and a morning run. In the evening, guests grow closer over food and wine; in the morning, they run the Aewol coastline together and make new memories. It’s a place where you can join in without pressure and enjoy company even when you came alone.',
      forWhom: [
        'Anyone who wants to keep a morning routine, even on the road',
        'Solo travelers who’d like to mingle, lightly',
        'Those more curious about neighborhood mornings than tourist sights',
      ],
      hero: { alt: 'A two-story brown building with ‘SAE AEWOL’ written large on its exterior wall', caption: 'Sae Aewol' },
      placeName: 'Sae Aewol',
      area: 'Aewol-eup, Jeju City',
      oneLine: 'A stay where evenings are tinted with wine and mornings begin with a sea breeze.',
      programs: [
        {
          name: 'Wine & Western Dinner + Fire Gazing',
          info: [
            { label: 'Time', value: '7:30 PM' },
            { label: 'Price', value: 'KRW 30,000' },
          ],
          photos: [
            { alt: 'Guests gathered around a table in the yard under strings of light bulbs (faces blurred)', caption: 'Dinner in the yard' },
            { alt: 'Hands toasting marshmallows on skewers over a campfire', caption: 'Fire gazing after dinner' },
          ],
          text: [
            'A time to enjoy a Western-style dinner and wine prepared by the owner, and to get to know other guests naturally. On fine days, dinner is served in the yard; afterward, you can gaze into the campfire and wind down the Jeju night at an easy pace.',
          ],
        },
        {
          name: 'Morning Run & Sea Swim',
          info: [
            { label: 'Time', value: '8:30 AM (adjustable on request)' },
            { label: 'Price', value: 'No participation fee' },
          ],
          photos: [
            { alt: 'Guests running along the Aewol seaside path on a clear day (faces blurred)', caption: 'Running the Aewol coast' },
            { alt: 'Guests waving from the blue sea with wind turbines in the distance (faces blurred)', caption: 'A sea swim after the run' },
          ],
          text: [
            'The day begins with a run along the Aewol coastline with fellow guests. After the run, you can dive into the cool sea for a swim. Running in the Jeju sea breeze and opening the day in the water makes for a rare kind of morning.',
          ],
          note: 'The sea swim may or may not go ahead depending on the weather and sea conditions.',
        },
      ],
      experience: [],
    },

    cinema: {
      title: 'How to Lose Yourself in the Screen',
      kicker: 'The moment the lights go down, you watch the same scene with strangers.',
      intro:
        'The owner once ran a restaurant on the mainland and grew worn out by the noise of drunk customers. In the name of ‘true rest,’ the owner boldly cleared away even the breakfast tables — and that space has become a small cinema where, every night, nine travelers gather to quietly lose themselves in hidden gems.',
      forWhom: [
        'Anyone who wants an evening that isn’t awkward, even alone',
        'Those who’d rather share a scene than make conversation',
        'Anyone who needs an indoor plan for a rainy day',
      ],
      hero: {
        alt: 'The white building and lawn of Shym Guesthouse, with ‘JEJUSHYM’ lettering on the stone wall',
        caption: 'Shym Guesthouse',
      },
      placeName: 'Shym Guesthouse',
      area: 'Hallim-eup, Jeju City',
      oneLine:
        'A quiet stay where you watch hidden gems through speakers the owner carved by hand, and share an unhurried afterglow with strangers.',
      programs: [
        {
          name: 'The Little Cinema',
          info: [
            { label: 'Time', value: '8:00 PM' },
            { label: 'Price', value: 'No extra charge' },
          ],
          photos: [
            { alt: 'Travelers on wooden sofas watching a large screen in a dark screening room', caption: 'The little cinema, every night' },
          ],
          text: [
            'Held every evening at 8, free of charge. Instead of the ten-million-viewer blockbusters everyone already knows, the owner hand-picks hidden gems with 2 million viewers or fewer, or soulful music films, played through the full sound of the owner’s handmade speakers.',
          ],
        },
      ],
      experience: [],
    },

    flower: {
      title: 'How to Fill a Day with Flowers',
      kicker: 'Before the vase does, your fingertips notice the season.',
      intro: '',
      forWhom: [
        'Anyone who wants to bring home something made by hand',
        'Those who need a stretch of quiet focus',
        'Anyone who wants to see the season’s colors up close',
      ],
      hero: { alt: 'A ‘Kokoko Guest House’ sign hanging on a white wooden wall', caption: 'Kokoko Guesthouse' },
      placeName: 'Kokoko',
      area: 'Gujwa-eup, Jeju City',
      oneLine: 'A stay made up of single rooms, so women traveling alone can settle in comfortably.',
      programs: [
        {
          name: 'Flower Arranging Class',
          info: [
            { label: 'Price', value: 'KRW 25,000 (50% off for guests)' },
            { label: 'Time', value: '1 hour' },
          ],
          photos: [
            { alt: 'A cat asleep beside a bouquet of gerberas and carnations on the lounge table', caption: 'Flowers and a cat in the lounge' },
          ],
          text: [
            'A chance to make your own flower basket with Jeju blooms that change with the seasons. Guests get 50% off the class fee, which makes it all the more special.',
            'It’s run by a shop-in-shop florist inside the guesthouse lounge, and was designed so that solo travelers can spend some restorative time.',
            'As you carefully trim each stem and play with colors that go together, the clutter of everyday thoughts quietly slips away — and three cats keep you company the whole time.',
          ],
          note: 'The time is flexible — just arrange it with the florist.',
        },
        {
          name: 'Oreum Sunrise',
          info: [
            { label: 'Price', value: 'KRW 15,000' },
            { label: 'Time', value: '1 hour' },
          ],
          photos: [
            { alt: 'A traveler at the railing of an oreum lookout, facing a red-tinged sky and sea', caption: 'Morning on top of the oreum' },
          ],
          text: [
            'Early in the morning, join a special program: climb an oreum with a villager who runs the tour, and watch the sunrise.',
            'Greeting the morning together in Jeju, you get close to the island’s everyday life and mood, beyond the scenery.',
          ],
          note: 'The time is announced the day before.',
        },
      ],
      editorProfile: {
        title: 'A traveler who savors time alone but also loves meeting new people',
        tags: ['New experiences', 'Hidden spots', 'Quiet healing', 'Slow travel'],
      },
      experience: [
        'I loved the calm, as if time were moving more slowly. From the breakfast the staff made with such care to flower arranging and the sunrise, it was a place that made my time alone feel even more special.',
      ],
      recommend: [
        'For anyone looking for a women-only stay where they can feel safe on their own, and for those who want quiet rest and small experiences rather than crowded tourist spots.',
      ],
    },

    lp: {
      title: 'How to Spend a Jeju Night with LPs',
      kicker: 'The night begins with the sound of a needle settling into the groove.',
      intro:
        'Seoron Guesthouse grew out of the owner’s love of LPs, with the hope of going beyond listening alone and create a space where music could be shared with others. Every evening there’s an LP listening hour devoted entirely to the music, and once every two months a listening party where guests share their tastes around a single musician.',
      forWhom: [
        'Anyone who wants to spend their travel nights quietly',
        'Those who’d like to share their taste with strangers through music',
        'Anyone who loves the hands-on feel of analog',
      ],
      hero: { alt: 'Exterior of Seoron Guesthouse (photo to be replaced)', caption: 'Seoron Guesthouse' },
      placeName: 'Seoron Guesthouse',
      area: 'Andeok-myeon, Seogwipo',
      oneLine: 'A stay where you listen to LPs, share your taste with strangers, and take the Jeju night slowly.',
      programs: [
        {
          name: 'LP Listening Hour',
          info: [
            { label: 'Time', value: '6:00–7:00 PM' },
            { label: 'Price', value: 'No participation fee' },
          ],
          text: [
            'Every evening, a time to step away from the noise around you and focus entirely on the music. If there’s a song you want to hear, you can request it from the owner and listen on vinyl. Even familiar songs you usually play through earphones feel new in the warm tone unique to LPs. It’s a program for listening slowly, one track at a time.',
          ],
        },
        {
          name: 'Listening Party',
          info: [
            { label: 'Schedule', value: 'Once every two months' },
            { label: 'Time · Price', value: 'Varies by session — please check' },
          ],
          text: [
            'A listening party that explores a single musician in depth. Guests listen to that artist’s music together, then share their impressions and their tastes. It’s a special chance to connect with strangers met in Jeju through the music you love.',
          ],
        },
      ],
      editorProfile: {
        title: 'An editor who loves analog moods and music',
        tags: ['Analog mood', 'Music listening', 'New experiences'],
        about: [
          'I’m drawn to all things analog, and I listen to music whenever I’m resting at home or on the move. When I travel, I like seeking out atmospheric spaces and trying new experiences I don’t usually get to have.',
        ],
      },
      experience: [
        'Hearing music I usually play through earphones on an LP felt completely different. What struck me most was a space and atmosphere where I could focus on nothing but the music. It was lovely to slow down for a while with songs I love.',
      ],
      recommend: ['For anyone who loves analog and wants a special listening experience on vinyl.'],
    },

    book: {
      title: 'How to Talk with Strangers Through Books',
      kicker: 'Sentences read on the road stay with you at a different temperature.',
      intro:
        'Ten years ago, the owner — then thirty — and a younger brother started a modest gathering, half hoping to pick up some dating tips. Today it has become an honest hour where ten people sit in a circle every night and open up about what is missing in their lives and relationships.',
      forWhom: [
        'Anyone who always packs a book in their travel bag',
        'Those who feel quiet as consideration rather than discomfort',
        'Anyone who seeks out small bookshops wherever they travel',
      ],
      hero: { alt: 'The ‘서점숙소 @bookhome’ logo painted on a white wall under a blue sky', caption: 'Seojeom Sukso (Bookstore Stay)' },
      placeName: 'Seojeom Sukso (Bookstore Stay)',
      area: 'Jocheon-eup, Jeju City',
      oneLine: 'A stay where books open the door to conversations about love with strangers.',
      programs: [
        {
          name: 'Conversation Circle ‘To the Oreum’',
          info: [
            { label: 'Time', value: '8:00 PM on check-in day' },
            { label: 'Price', value: 'No participation fee' },
          ],
          photos: [
            { alt: 'A study lined with books and a long wooden table by the window', caption: 'The study where the circle meets' },
          ],
          text: [
            'A conversation circle held every evening at 8 in front of the shared study. For 40 minutes you read and copy out passages by hand, then take turns reading aloud and talking. It’s a chance to talk about love with strangers.',
          ],
          note: 'It runs with 3 or more sign-ups and may be canceled with fewer than 3.',
        },
        {
          name: 'Bookbinding Class',
          info: [
            { label: 'Time', value: '5:00 PM on check-in day or 11:00 AM on check-out day' },
            { label: 'Price', value: 'KRW 28,000 (materials included)' },
          ],
          photos: [
            { alt: 'A handmade transcription notebook with a photo cover, held up in front of the study', caption: 'A transcription notebook, made by hand' },
          ],
          text: [
            'Make a transcription notebook that reflects your own taste. You’ll learn the basic structure and principles of handmade bookbinding.',
          ],
        },
      ],
      experience: [],
    },

    craft: {
      title: 'Travel Worries, Sanded Away at My Fingertips',
      kicker: 'When your hands get busy, your mind slows down.',
      intro:
        'An introverted owner who once worked at another guesthouse and grew tired of constant run-ins with people. After moving to Jeju to focus only on what they truly love, the owner converted an abandoned warehouse into a woodworking studio — and Seureureu Guesthouse was born to share that pure joy of absorption.',
      forWhom: [
        'Anyone who’d rather make a keepsake than buy a souvenir',
        'Those who love quietly losing themselves in one task',
        'Anyone who wants to get to know people slowly, working side by side',
      ],
      hero: {
        alt: 'A wooden sign reading ‘Seureureu Guest House · Ujugonggan Wood Ring Studio’',
        caption: 'Seureureu Guesthouse · Ujugonggan Wood Ring Studio',
      },
      placeName: 'Seureureu Guesthouse',
      area: 'Hogeun-dong, Seogwipo',
      oneLine:
        'A stay for deep focus, where carving your own wooden ring in Jeju lets the worries of a busy life drift gently away.',
      introQuote: '“Honestly, the wood ring studio came before the guesthouse.”',
      programs: [
        {
          name: 'Wood Ring One-Day Class',
          info: [
            { label: 'Studio', value: 'Ujugonggan Wood Ring Studio' },
            { label: 'Time', value: '10:00–11:30 · 12:30–14:00 · 14:30–16:00' },
            { label: 'Duration', value: '1 hr – 1 hr 30 min' },
            { label: 'Price', value: 'KRW 32,000 (KRW 29,000 for guests)' },
            { label: 'Add-ons', value: 'Special wood +KRW 0–6,000 · Laser engraving +KRW 0–5,000' },
          ],
          photos: [
            { alt: 'A studio workbench along the window, set with desk lamps and work mats', caption: 'The workbench by the window' },
          ],
          text: [
            'Make a one-of-a-kind keepsake to take home from Jeju. In this program you pick the hardwood that suits you and sand it by hand into a wooden ring.',
            'Step away from Jeju’s crowded sights for a while, keep the calm view outside the window beside you, and focus on nothing but the sound of sandpaper — before you know it, your own quiet Jeju trip is left at your fingertips as a solid little piece.',
          ],
        },
      ],
      editorProfile: {
        title: 'An editor in need of calm, focused time',
        label: 'EDITOR 01 · A traveler who likes an easy, natural warmth',
        tags: ['Introverted traveler', 'Deep focus', 'Small groups', 'Loose ties', 'Experience collector'],
        about: [
          'I love quiet time on my own, but I also look forward to small, simple connections when I travel. Rather than loud, forced energy, I prefer a relaxed atmosphere where conversation opens up naturally while everyone focuses on something.',
        ],
      },
      experience: [
        'I loved being able to lose myself completely in sanding my wooden ring, without any pressure to force friendships with strangers. The small talk with the owner while I worked felt so comfortable.',
      ],
      recommend: [
        'For anyone worn out by big party guesthouses where you have to force your energy up. If you’re an introvert who needs a ‘go-between’ for conversation, carving wood with an empty mind will clear away the clutter and let you fully enjoy Jeju’s quiet nights.',
      ],
    },

    camping: {
      title: 'How to Gather Around a Campfire',
      kicker: 'Light a fire, and even strangers face the same way.',
      intro: '',
      forWhom: [
        'Anyone who’d rather spend a night outdoors than in',
        'Those who bond by doing things together rather than talking',
        'Anyone who wants to camp but has no gear',
      ],
      hero: { alt: 'A hand-lettered sign on a wooden post reading ‘Mureung Shwimpyo, slowly, 60m →’', caption: 'Mureung Shwimpyo' },
      placeName: 'Mureung Shwimpyo',
      area: 'Daejeong-eup, Seogwipo',
      oneLine: 'Tucked into the quiet village of Mureung-ri in Seogwipo, a stay for travelers who need real rest.',
      programs: [
        {
          name: 'Snap Photos',
          info: [
            { label: 'Price', value: 'KRW 50,000' },
            { label: 'Time', value: '2 hours' },
          ],
          photos: [
            { alt: 'A traveler seen from behind, standing in a field of white buckwheat flowers', caption: 'Snaps in the buckwheat field' },
          ],
          text: [
            'The owner is a professional photographer by trade. The snap photo sessions capture seasonal spots across Jeju that the owner scouted on foot. Capture moments of your trip against Jeju’s beautiful scenery.',
            'More than a place to simply stay, Mureung Shwimpyo is where memories pile up along with the photos.',
          ],
          note: 'Shooting spots and times are arranged over KakaoTalk the day before.',
        },
        {
          name: 'Potluck Party & Fire Gazing',
          info: [
            { label: 'Price', value: 'KRW 25,000' },
            { label: 'Time', value: '3 hours' },
          ],
          photos: [
            { alt: 'Sashimi, boiled pork, tteokbokki, chicken, rice and soup laid out on a long wooden table', caption: 'The potluck spread' },
          ],
          text: [
            'As the sunset settles over Jeju, a potluck party with fellow travelers begins in the aurora tent. With dishes lovingly made by the staff added to the table, everyone shares their stories over a warm dinner — and once the potluck wraps up, you can move to the tent next door for some fire gazing.',
            'Amid crackling flames and the cool night air, it’s a time when you naturally grow closer, even to travelers you’ve just met.',
          ],
          note: 'Bring any dish you like in the KRW 10,000 range; joining partway through is fine.',
        },
      ],
      experience: [],
    },

    homemeal: {
      title: 'How to Get Close to Strangers over a Home-Cooked Meal',
      kicker: 'The joy of sharing dinner on a solo trip to Jeju',
      intro:
        'Among countless Jeju guesthouses, the owner wondered what would make Susu Minbak special. What the owner was most confident in was a warm home-cooked meal, like one your mom would make. The dinner program that grew from it has become a time when solo travelers sit around one table, sharing food and stories.',
      forWhom: [
        'Solo travelers who still want to share dinner with someone',
        'Those who prefer easy conversation to rowdy parties',
        'Anyone who’s a little shy but wants to mingle comfortably',
      ],
      hero: {
        alt: 'The Susu Minbak sign on a wooden wall, with an olive tree by the entrance',
        caption: 'The entrance to Susu Minbak',
      },
      placeName: 'Susu Minbak',
      area: 'Andeok-myeon, Seogwipo',
      oneLine:
        'A guesthouse where you share a warm, home-cooked meal made by the owner and naturally fall in with new people.',
      programs: [
        {
          name: 'Susu’s Simple Supper',
          info: [
            { label: 'Time', value: '7:30–11:30 PM' },
            { label: 'Price', value: 'KRW 30,000' },
          ],
          photos: [
            { alt: 'Dombe-gogi boiled pork and an array of side dishes laid out on the Susu Minbak dinner table', caption: 'The simple supper spread' },
          ],
          text: [
            'A dinner program where everyone shares a home-cooked meal the owner has lovingly prepared. Travelers who spent their own day across Jeju come back and gather at one table. It’s a little awkward at first, but as you share good food and swap travel stories, laughter soon fills the room. Even on a solo trip to Jeju, you get to enjoy the pleasure of dinner with company.',
          ],
        },
        {
          name: 'Morning Walk',
          info: [
            { label: 'Time', value: '7:00 AM' },
            { label: 'Price', value: 'Free' },
          ],
          photos: [
            { alt: 'Cliffs and a calm sea along the Daepyeong-ri coast', caption: 'The Daepyeong-ri seaside path' },
          ],
          text: [
            'A morning walk along the Daepyeong-ri seaside path where the owner often goes running. Smitten with scenery too beautiful to tire of, even every day, the owner decided to build the guesthouse here. Walking along quiet Daepyeong Port and the sea, you can enjoy a Jeju morning without rushing.',
          ],
        },
      ],
      editorProfile: {
        title: 'An editor who travels solo but still wants dinner with company',
        tags: ['Solo traveler', 'Food first', 'Easy conversation', 'Unhurried travel'],
      },
      experience: [
        'The dinner the owner made with such care is what I remember most. From the dombe-gogi boiled pork to all the side dishes, the generous spread was great — but sharing a meal and chatting naturally with guests I’d just met made it even more special.',
        'The four-person room I stayed in had a curtain on every bed, so I could enjoy time to myself too. Each room has its own bathroom and everything was spotless, so I got to enjoy both time with others and time on my own.',
      ],
      recommend: [
        'For anyone who loves traveling solo but would like to share at least one dinner with someone.',
        'If you’d rather share good food and easy conversation than go to a rowdy party, Susu Minbak will suit you well. The owner and staff look after everyone warmly, so even shy travelers can feel at ease.',
      ],
    },

    wine: {
      title: 'How to Spend a Jeju Evening over a Glass of Wine',
      kicker: 'The night flows as slowly as the glass empties.',
      intro:
        'Ten years ago, after quitting a job, the owner worked as guesthouse staff and dreamed of a place of their own. Back then, guesthouse dinners were mostly Korean food. The winery dinner began from a wish to break from that and share the Western dishes and wine the owner had come to love while living abroad.',
      forWhom: [
        'Anyone who wants to close their travel nights quietly',
        'Those who enjoy a good glass and good conversation',
        'Anyone more at ease at a calm table than a noisy drinking session',
      ],
      hero: { alt: 'A rusted iron ‘Rooftop Garden’ sign on a stone wall, and a stone path through the garden', caption: 'Rooftop Garden' },
      placeName: 'Rooftop Garden',
      area: 'Namwon-eup, Seogwipo',
      oneLine: 'A stay where a winery dinner turns an evening into something special.',
      programs: [
        {
          name: 'Winery Dinner',
          info: [
            { label: 'Time', value: '8:00 PM on check-in day' },
            { label: 'Price', value: 'KRW 30,000' },
          ],
          photos: [
            { alt: 'Ratatouille, risotto, pasta, boiled pork, salad and sparkling wine on a candlelit table', caption: 'The winery dinner' },
          ],
          text: [
            'A winery dinner of gambas, risotto, pasta and steak made with Jeju-grown ingredients, served with wine. You can dine while chatting with other guests.',
          ],
          note: 'The winery dinner is by reservation only — simply reply to your check-in text message to sign up.',
        },
      ],
      editorProfile: {
        title: 'An editor who tried solo travel as a new experience',
        tags: ['First solo trip', 'Planner', 'Loves new things', 'Do it all'],
        about: [
          'I’m usually spontaneous, but when it comes to travel I like to plan. I’m not someone who typically enjoys traveling alone, but I wanted to try something new, so I set off for Jeju on my own. If there’s a special experience to be had somewhere, I don’t want to miss it.',
        ],
      },
      experience: [
        'The food at the winery dinner is what I remember most. Hearing the owner explain that the dishes used local ingredients like Jeju black pork made it feel even more special. The portions were generous and everything was delicious — I was completely satisfied.',
        'Above all, sitting at one table with guests I’d just met, sharing food and pouring wine for one another, we became friends naturally. Thanks to that shared dinner, even a solo trip turned out to be a lot of fun.',
      ],
      recommend: [
        'Recommended for anyone who loves wine and Western food — especially those who came to Jeju alone but want to enjoy at least one glass with someone. Also a great fit for anyone hoping to spend a special evening at the end of the year or on an anniversary.',
      ],
    },
  },

  /* ---------------------------------------------------------------- quiz */
  quiz: {
    questions: {
      q1: {
        context: 'the Jeju guesthouse you’re drawn to',
        q: 'A Jeju guesthouse I love is one that’s…',
        options: {
          A: 'A place to rest quietly and deeply',
          B: 'A place that feels lived-in and full of people',
        },
      },
      q2: {
        context: 'meeting guests in the lounge',
        q: 'Check-in! A few guests are already in the lounge.',
        options: {
          A: 'A quick nod, then straight to my room',
          B: '“Where are you from?” — I start the conversation',
        },
      },
      q3: {
        context: 'a day of nonstop rain',
        q: 'Rain is forecast all day.',
        options: {
          A: 'Take a one-day class at the guesthouse',
          B: 'Rain or not, I’m going out to shoot rainy Jeju',
        },
      },
      q4: {
        context: 'tonight’s dinner',
        q: 'What’s for dinner tonight?',
        options: {
          A: 'A home-cooked meal made by the host',
          B: 'A Western dinner paired with wine',
        },
      },
      q5: {
        context: 'after dinner at the guesthouse',
        q: 'After dinner, if you could do just one thing at the guesthouse…',
        options: {
          A: 'Watch a movie together',
          B: 'Listen to music on LP',
        },
      },
      q6: {
        context: 'late-night conversations',
        q: 'Talking with people at night, I’d rather…',
        options: {
          A: 'A deep talk that starts from a line in a book',
          B: 'Light chatter in front of a bonfire',
        },
      },
      q7: {
        context: 'your rhythm on a trip',
        q: 'When I travel, I’m…',
        options: {
          A: 'An early-rising morning person',
          B: 'A night owl who stays up late',
        },
      },
      q8: {
        context: 'heading out early',
        q: 'If you head out early in the morning…',
        options: {
          A: 'Climb an oreum to watch the sunrise',
          B: 'Run along the coastal road',
        },
      },
      q9: {
        context: 'a keepsake from Jeju',
        q: 'What I want to keep as a Jeju souvenir is…',
        options: {
          A: 'Something I made with my own hands',
          B: 'A photo of me in a Jeju landscape',
        },
      },
      q10: {
        context: 'sharing one thing with someone new',
        q: 'If you could share just one thing with someone you just met…',
        options: {
          A: 'A glass of wine',
          B: 'A warm meal together',
        },
      },
    },

    types: {
      adventurer: {
        name: 'The Adventurous Traveler',
        en: 'THE MOVER',
        tagline: 'Your Jeju shines brightest when you’re on the move.',
        description:
          'You remember a landscape with your body before your eyes. The moment you run out of breath, the moment the wind changes direction — those become the scenes of your trip. Walk side by side with strangers, warm yourselves at the same fire, and before long you’re friends.',
        travelStyle: [
          'Wake before sunrise and run a neighborhood morning route',
          'Spend at least one night under the sky instead of a roof',
          'Talk through tomorrow’s route in front of a campfire at night',
        ],
      },
      collector: {
        name: 'The Sensory Collector',
        en: 'THE COLLECTOR',
        tagline: 'You travel deeply, even in quiet moments.',
        description:
          'For you, travel is about collecting sounds and sentences. You look for a place to sit for a long while before any crowded landmark. Among people who share a space without words, you actually feel most at ease.',
        travelStyle: [
          'Choose one place a day to linger in',
          'Pack good music and a book as carefully as your itinerary',
          'At night, turn the volume up and your voice down',
        ],
      },
      maker: {
        name: 'The Hands-On Recorder',
        en: 'THE MAKER',
        tagline: 'You’re someone who makes the moments of a trip yourself.',
        description:
          'Just seeing and hearing isn’t quite enough for you. Trimming a single flower, carving a piece of wood, cooking a meal to share — that’s when a place finally becomes yours. It’s fine if the result comes out a little crooked. That crookedness is the memory.',
        travelStyle: [
          'Keep an afternoon free for a hands-on program',
          'Don’t buy souvenirs — make them',
          'Cook and share dinner with people you’ve just met',
        ],
      },
      keeper: {
        name: 'The Scene Keeper',
        en: 'THE KEEPER',
        tagline: 'For you, travel is a series of scenes that stay with you.',
        description:
          'You’re the kind of person who takes the trip once more after it’s over. A scene from a film watched together, the air of a night spent tilting glasses — they grow sharper as time goes by. You know how this moment will be remembered later.',
        travelStyle: [
          'Close the day slowly, without rushing',
          'Spend the night sharing the same screen or the same bottle',
          'Keep the scenes of your trip so you can revisit them for years',
        ],
      },
    },
  },
};
