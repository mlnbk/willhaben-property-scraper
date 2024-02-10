const getListings = async (url) => {
  const response = await fetch(url);
  const string = await response.text();
  const temp = string.substring(string.indexOf('<script id="__NEXT_DATA__" type="application/json">') + '<script id="__NEXT_DATA__" type="application/json">'.length);
  const result = JSON.parse(temp.substring(0, temp.indexOf('</script>')));
  const returnArray = [];

  result.props.pageProps.searchResult.advertSummaryList.advertSummary.forEach((returnObj) => {
    const modifiedObj = {};
    returnObj.attributes.attribute.forEach((element) => {
      const propertyName = element.name.toLowerCase();
      if (
        propertyName === 'postcode'
            || propertyName === 'number_of_rooms'
            || propertyName === 'price'
            || propertyName === 'estate_size'
            || propertyName === 'location_quality'
            || propertyName === 'is_bumped'
            || propertyName === 'floor'
            || propertyName === 'isprivate'
            || propertyName === 'number_of_children'
            || propertyName === 'free_area_type'
            || propertyName === 'estate_size/useable_area'
            || propertyName === 'estate_size/living_area'
      ) {
        modifiedObj[propertyName] = Number.isNaN(element.values[0])
          ? element.values[0]
          : +element.values[0];
      }
    });

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
  burgenland: 'burgenland',
  carinthia: 'kaernten',
  'lower austria': 'niederoesterreich',
  'upper austria': 'oberoesterreich',
  salzburg: 'salzburg',
  styria: 'steiermark',
  tyrol: 'tirol',
  vorarlberg: 'vorarlberg',
  vienna: 'wien',
});

class WillhabenPropertySearch {
  constructor() {
    this.searchCount = 1000;
    this.searchCategory = '';
    this.federalState = '';
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
    this.federalState = state;
    return this;
  }

  getURL() {
    return `https://willhaben.at/iad/immobilien/${this.searchCategory}/`
        + `${this.federalState ? `${this.federalState}` : `${categoriesPostfix[this.searchCategory]}`}`;
  }

  async search() {
    const listings = [];
    const numOfPages = Math.ceil(this.searchCount / 10);

    for (let i = 0; i < numOfPages; i++) {
      const url = `${this.getURL()}${this.federalState ? '?' : '?&'}page=${i + 1}`;
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
