const getListings = async (url) => {
  const response = await fetch(url);
  const string = await response.text();
  const temp = string.substring(
    string.indexOf('<script id="__NEXT_DATA__" type="application/json">') + '<script id="__NEXT_DATA__" type="application/json">'.length,
  );
  const result = JSON.parse(temp.substring(0, temp.indexOf('</script>')));
  const returnArray = [];

  result.props.pageProps.searchResult.advertSummaryList.advertSummary.forEach((returnObj) => {
    const modifiedObj = {};
    returnObj.attributes.attribute.forEach((element) => {
      const propertyName = element.name.toLowerCase();
      if (
        propertyName === 'ad_uuid' ||
        propertyName === 'country' ||
        propertyName === 'postcode' ||
        propertyName === 'state' ||
        propertyName === 'district' ||
        propertyName === 'location' ||
        propertyName === 'number_of_rooms' ||
        propertyName === 'price' ||
        propertyName === 'estate_size' ||
        propertyName === 'location_quality' ||
        propertyName === 'floor' ||
        propertyName === 'free_area_type' ||
        propertyName === 'estate_size/useable_area' ||
        propertyName === 'estate_size/living_area'
      ) {
        modifiedObj[propertyName] =
          Number.isNaN(Number(element.values[0])) || propertyName === 'free_area_type' ? element.values[0] : Number(element.values[0]);
      }
    });

    if (
      !modifiedObj.price ||
      (modifiedObj.price && Number.isNaN(Number(modifiedObj.price))) ||
      !modifiedObj.ad_uuid ||
      !modifiedObj.country ||
      modifiedObj.country !== 'Österreich' ||
      !modifiedObj.state ||
      !modifiedObj.district
    ) {
      return;
    }

    returnArray.push(modifiedObj);
  });

  return returnArray;
};

const categories = Object.freeze({
  'apartment rent': 'mietwohnungen',
  'apartment buy': 'eigentumswohnung',
  'house rent': 'haus-mieten',
  'house buy': 'haus-kaufen',
});

const categoriesPostfix = Object.freeze({
  mietwohnungen: 'mietwohnung-angebote',
  eigentumswohnung: 'eigentumswohnung-angebote',
  'haus-mieten': 'haus-angebote',
  'haus-kaufen': 'haus-angebote',
});

const states = Object.freeze({
  burgenland: {
    name: 'burgenland',
    districts: {
      eisenstadt: 'eisenstadt',
      'eisenstadt-umgebung': 'eisenstadt-umgebung',
      güssing: 'güssing',
      jennersdorf: 'jennersdorf',
      mattersburg: 'mattersburg',
      'neusiedl-am-see': 'neusiedl-am-see',
      oberpullendorf: 'oberpullendorf',
      oberwart: 'oberwart',
      'rust-stadt': 'rust-stadt-',
    },
  },
  carinthia: {
    name: 'kaernten',
    districts: {
      feldkirchen: 'feldkirchen',
      hermagor: 'hermagor',
      'klagenfurt-land': 'klagenfurt-land',
      klagenfurt: 'klagenfurt',
      'st-veit-an-der-glan': 'st-veit-an-der-glan',
      'spittal-an-der-drau': 'spittal-an-der-drau',
      'villach-land': 'villach-land',
      villach: 'villach',
      voelkermarkt: 'voelkermarkt',
      wolfsberg: 'wolfsberg',
    },
  },
  'lower austria': {
    name: 'niederoesterreich',
    districts: {
      amstetten: 'amstetten',
      baden: 'baden',
      'bruck-an-der-leitha': 'bruck-an-der-leitha',
      gaenserndorf: 'gaenserndorf',
      gmuend: 'gmuend',
      hollabrunn: 'hollabrunn',
      horn: 'horn',
      korneuburg: 'korneuburg',
      'krems-land': 'krems-land',
      'krems-stadt': 'krems-stadt',
      lilienfeld: 'lilienfeld',
      melk: 'melk',
      mistelbach: 'mistelbach',
      moedling: 'moedling',
      neunkirchen: 'neunkirchen',
      scheibbs: 'scheibbs',
      'st-poelten-land': 'st-poelten-land',
      'st-poelten-stadt': 'st-poelten-stadt',
      tulln: 'tulln',
      'waidhofen-an-der-thaya': 'waidhofen-an-der-thaya',
      'waidhofen-an-der-ybbs': 'waidhofen-an-der-ybbs',
      weinviertel: 'weinviertel',
      'wiener-neustadt-land': 'wiener-neustadt-land',
      'wiener-neustadt-stadt': 'wiener-neustadt-stadt',
      zwettl: 'zwettl',
    },
  },
  'upper austria': {
    name: 'oberoesterreich',
    districts: {
      braunau: 'braunau',
      eferding: 'eferding',
      freistadt: 'freistadt',
      grieskirchen: 'grieskirchen',
      kirchdorf: 'kirchdorf',
      linz: 'linz',
      'linz-land': 'linz-land',
      perg: 'perg',
      ried: 'ried',
      rohrbach: 'rohrbach',
      schärding: 'schärding',
      steyr: 'steyr',
      'steyr-land': 'steyr-land',
      urfahr: 'urfahr',
      'urfahr-umgebung': 'urfahr-umgebung',
      vöcklabruck: 'vöcklabruck',
      wels: 'wels',
      'wels-land': 'wels-land',
    },
  },
  salzburg: {
    name: 'salzburg',
    districts: {
      hallein: 'hallein',
      salzburg: 'salzburg',
      'salzburg-umgebung': 'salzburg-umgebung',
      'st-johann': 'st-johann',
      tamsweg: 'tamsweg',
      'zell-am-see': 'zell-am-see',
    },
  },
  styria: {
    name: 'steiermark',
    districts: {
      'bruck-an-der-mur': 'bruck-an-der-mur',
      deutschlandsberg: 'deutschlandsberg',
      feldbach: 'feldbach',
      furstenfeld: 'furstenfeld',
      graz: 'graz',
      'graz-umgebung': 'graz-umgebung',
      'hartberg-fuerstenfeld': 'hartberg-fuerstenfeld',
      leibnitz: 'leibnitz',
      leoben: 'leoben',
      liezen: 'liezen',
      murau: 'murau',
      murtal: 'murtal',
      südoststeiermark: 'südoststeiermark',
      voitsberg: 'voitsberg',
      weiz: 'weiz',
    },
  },
  tyrol: {
    name: 'tirol',
    districts: {
      imst: 'imst',
      innsbruck: 'innsbruck',
      'innsbruck-land': 'innsbruck-land',
      kitzbühel: 'kitzbühel',
      kufstein: 'kufstein',
      landeck: 'landeck',
      lienz: 'lienz',
      reutte: 'reutte',
      schwaz: 'schwaz',
    },
  },
  vorarlberg: {
    name: 'vorarlberg',
    districts: {
      bludenz: 'bludenz',
      bregenz: 'bregenz',
      dornbirn: 'dornbirn',
      feldkirch: 'feldkirch',
    },
  },
  vienna: {
    name: 'wien',
    districts: [],
  },
});

class WillhabenPropertySearch {
  constructor() {
    this.searchCount = 1000;
    this.searchCategory = '';
    this.searchState = null;
    this.searchDistrict = '';
  }

  category(category) {
    if (!Object.values(categories).includes(category)) {
      throw new Error('Invalid category! Use one of `WillhabenPropertySearch.categories`.');
    }
    this.searchCategory = category;
    return this;
  }

  count(count) {
    if (!Number.isInteger(count) || count < 1) {
      throw new Error('Count has to be a positive integer!');
    }
    this.searchCount = count;
    return this;
  }

  state(state) {
    if (!Object.values(states).includes(state)) {
      throw new Error('Invalid state! Use one of `WillhabenPropertySearch.states`.');
    }
    this.searchState = state;
    return this;
  }

  district(district) {
    if (!this.searchState) {
      throw new Error('You have to set the state first!');
    }
    if (!Object.values(this.searchState.districts).includes(district)) {
      throw new Error(`Invalid district for ${this.searchState}!`);
    }
    this.searchDistrict = district;
    return this;
  }

  getURL() {
    let url = 'https://willhaben.at/iad/immobilien/';

    if (this.searchCategory) {
      url += `${this.searchCategory}/`;
      if (this.searchState) {
        if (this.searchDistrict) {
          url += `${this.searchState.name}/${this.searchDistrict}`;
        } else {
          url += this.searchState.name;
        }
        url += '?';
      } else {
        url += categoriesPostfix[this.searchCategory];
        url += '?&';
      }
    }

    return url;
  }

  async search() {
    const listings = [];
    const numOfPages = Math.ceil(this.searchCount / 10);

    for (let i = 0; i < numOfPages; i++) {
      const url = `${this.getURL()}page=${i + 1}`;
      const pageListings = await getListings(url);
      listings.push(...pageListings);

      if (listings.length >= this.searchCount) {
        break;
      }
    }

    return listings.slice(0, this.searchCount);
  }
}

module.exports = WillhabenPropertySearch;
module.exports.categories = categories;
module.exports.states = states;
