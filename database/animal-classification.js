/* Dietary, biological-class, and reproductive classification for catalog profiles. */
(function (global) {
  const groups = {
    biologicalClass: {
      Mamalia: 'cat dog hamster rabbit guineapig chinchilla sugarglider ferret rat mouse hedgehog gerbil degu potbelliedpig horse goat sheep alpaca llama cow donkey',
      Burung: 'canary lovebird budgie finch pigeon chicken cockatiel africangrey macaw duck quail turkey parrotlet sunconure cockatoo zebrafinch eclectus greencheekconure amazonparrot',
      Ikan: 'betta goldfish guppy tetra molly corydoras angelfish koi platy zebradanio discus dwarfgourami swordtail harlequinrasbora bristlenosepleco kuhliloach clownfish cardinaltetra tigerbarb pearlgourami siamesealgaeeater bluetang royalgramma zebrafish',
      Reptil: 'turtle gecko iguana cornsnake beardeddragon ballpython crestedgecko redslider bluetongueskink russiantortoise kingsnake gargoylegecko veiledchameleon redfoottortoise uromastyx',
      Amfibi: 'axolotl whitetreefrog pacmanfrog africandwarffrog firebelliedtoad africanclawedfrog tomatofrog',
      Invertebrata: 'cherryshrimp neritesnail tarantula stickinsect hermitcrab jumpingspider millipede'
    },
    dietGroup: {
      Karnivora: 'cat ferret betta cornsnake gecko ballpython kingsnake tarantula axolotl whitetreefrog pacmanfrog africandwarffrog hedgehog royalgramma veiledchameleon firebelliedtoad africanclawedfrog tomatofrog jumpingspider',
      Herbivora: 'rabbit guineapig chinchilla degu horse goat sheep iguana russiantortoise stickinsect neritesnail alpaca llama cow donkey bluetang uromastyx millipede',
      Omnivora: 'dog hamster goldfish guppy tetra molly corydoras canary lovebird budgie finch turtle sugarglider rat mouse pigeon chicken cockatiel africangrey macaw beardeddragon redslider bluetongueskink angelfish koi platy zebradanio discus cherryshrimp neritesnail gerbil potbelliedpig duck quail turkey parrotlet sunconure cockatoo dwarfgourami swordtail harlequinrasbora bristlenosepleco kuhliloach clownfish gargoylegecko crestedgecko hermitcrab zebrafinch eclectus greencheekconure amazonparrot cardinaltetra tigerbarb pearlgourami siamesealgaeeater zebrafish redfoottortoise'
    },
    reproductionGroup: {
      Ovipar: 'betta goldfish tetra corydoras canary lovebird budgie finch turtle gecko iguana cornsnake mouse pigeon chicken axolotl cockatiel africangrey macaw beardeddragon ballpython crestedgecko redslider bluetongueskink angelfish koi zebradanio discus cherryshrimp neritesnail whitetreefrog pacmanfrog gerbil duck russiantortoise kingsnake gargoylegecko africandwarffrog tarantula stickinsect hermitcrab quail turkey parrotlet sunconure cockatoo dwarfgourami harlequinrasbora bristlenosepleco kuhliloach clownfish zebrafinch eclectus greencheekconure amazonparrot cardinaltetra tigerbarb pearlgourami siamesealgaeeater bluetang royalgramma veiledchameleon redfoottortoise uromastyx firebelliedtoad africanclawedfrog tomatofrog jumpingspider millipede zebrafish',
      Ovovivipar: 'guppy molly platy swordtail',
      Vivipar: 'cat dog hamster rabbit guineapig chinchilla sugarglider ferret rat mouse hedgehog gerbil degu potbelliedpig horse goat sheep alpaca llama cow donkey'
    }
  };
  const labels = {
    biologicalClass: {Mamalia:'Mamalia',Burung:'Burung',Ikan:'Ikan',Reptil:'Reptil',Amfibi:'Amfibi',Invertebrata:'Invertebrata'},
    dietGroup: {Karnivora:'Karnivora',Herbivora:'Herbivora',Omnivora:'Omnivora'},
    reproductionGroup: {Ovipar:'Ovipar',Ovovivipar:'Ovovivipar',Vivipar:'Vivipar'}
  };
  const result = {};
  for (const field of Object.keys(groups)) {
    for (const [label, ids] of Object.entries(groups[field])) {
      for (const id of ids.trim().split(/\s+/)) {
        result[id] ||= {};
        result[id][field] = labels[field][label];
      }
    }
  }
  // Every profile receives a source list for its diet and reproduction notes.
  global.HEWAN_ANIMAL_CLASSIFICATIONS = result;
  global.HEWAN_CLASSIFICATION_SOURCES = [
    'https://www.ncbi.nlm.nih.gov/mesh/68052285',
    'https://web.utk.edu/~rstrange/wfs550/html-con-pages/q-repro.html'
  ];
})(window);
