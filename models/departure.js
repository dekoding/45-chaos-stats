'use strict';

String.prototype.toTitleCase = function () {
  'use strict'
  var smallWords = /^(a|an|and|as|at|be|but|by|en|for|if|in|is|it|was|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i
  var alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/
  var wordSeparators = /([ :–—-])/

  return this.split(wordSeparators)
    .map(function (current, index, array) {
      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ':' &&
        array[index + 1] !== ':' &&
        /* Ignore small words that start a hyphenated phrase */
        (array[index + 1] !== '-' ||
          (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase()
      }

      /* Ignore intentional capitalization */
      if (current.substr(1).search(/[A-Z]|\../) > -1) {
        return current
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, function (match) {
        return match.toUpperCase()
      })
    })
    .join('')
}

module.exports = (sequelize, DataTypes) => {
  const Departure = sequelize.define('Departure', {
    LastName: DataTypes.STRING,
    FirstName: DataTypes.STRING,
    Affiliation: DataTypes.STRING,
    Position: DataTypes.STRING,
    DateHired: DataTypes.DATE,
    DateLeft: DataTypes.DATE,
    TotalTime: DataTypes.INTEGER,
    TrumpTime: DataTypes.INTEGER,
    MoochesTime: DataTypes.FLOAT,
    LeaveType: DataTypes.STRING,
    Notes: DataTypes.TEXT,
    Image: DataTypes.STRING,
    Sources: DataTypes.TEXT
  }, {
    getterMethods: {
      rendered() {
        var formatted = this.dataValues
        formatted.DateHired = this.DateHired.toLocaleDateString("en-US")
        formatted.DateLeft = this.DateLeft.toLocaleDateString("en-US")
        formatted.TotalTime = this.TotalTime.toLocaleString("en-US")
        formatted.Notes = this.Notes.toTitleCase()
        var splitSources = this.Sources.split('\n')
        var formSources = []
        for (var i = 0; i < splitSources.length; i++) {
          if ( (splitSources[i]) && (splitSources[i] != "") ) {
            formSources.push(splitSources[i])
          }
        }
        formatted.Sources = formSources
        return formatted
      }
    }
  });
  Departure.associate = function(models) {
    // associations can be defined here
  };
  return Departure;
};
