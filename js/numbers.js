Number.prototype.toWords = function() {
	var OnesWord = function( power ) {
		var n = new Number(power);
		n.toWords = function() { return this.word; };
		n.word = OnesWord._words[n];
		return n;
	};
	OnesWord._words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];

	var TensWord = function( power ) {
		var n = new Number(power);
		n.toWords = function() { return this.word; };
		n.word = TensWord._words[n];
		return n;
	};
	TensWord._words = [null, "ten", "twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety"];

	var HundredsWord = function( power ) {
		var n = new Number(power);
		n.toWords = function() { return this.word + " hundred"; };
		n.word = HundredsWord._words[n];
		return n;
	}
	HundredsWord._words = [null, "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];

	var TripleNumericWord = function( num ) {
		var n = new Number(num);
		var s = n.toFixed();
		// Pad with zeros to create a triplet.
		while( s.length != 3 ) s = "0" + s;
		n.ones = new OnesWord(s[2]);
		n.tens = new TensWord(s[1]);
		n.hundreds = new HundredsWord(s[0]);
		n.toWords = function() {
			var ret = new Array();

			// Hundreds
			if( this.hundreds != 0 ) {
				ret.push(this.hundreds.toWords());

				// The "and" special case
				if( this.tens > 0 || this.ones > 0 ) ret.push("and");
			}

			// "Teen" numbers
			if( this.tens == 1 ) {
				ret.push(new OnesWord(this.ones + 10).toWords());
			} else {
				if( this.tens != 0 ) ret.push(this.tens.toWords());
				if( this.ones != 0 || ret.length == 0 ) ret.push(this.ones.toWords());
			}

			return ret.join(" ");
		};
		return n;
	}
	TripleNumericWord._exponentials = [null, "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion", "quindecillion", "sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion", "unvigintillion", "duovigintillion", "tresvigintillion", "quattuorvigintillion", "quinquavigintillion", "sesvigintillion", "septemvigintillion", "octovigintillion", "novemvigintillion", "trigintillion", "untrigintillion", "duotrigintillion", "trestrigintillion", "quattuortrigintillion", "quinquatrigintillion", "sestrigintillion", "septentrigintillion", "octotrigintillion", "novemtrigintillion", "quadragintillion"];

	var toGroups = function( num, grouplen ) {
		var n = new Number(num);
		var s = n.toFixed().split("");
		var groups = new Array();
		while( s.length != 0 ) {
			var v = new Array();
			var end = Math.min(s.length, grouplen);
			for( var i = 0; i < end; i++ ) v.push(s.pop());
			groups.push(v.reverse().join(""));
		}
		return groups;
	}

	// By small here, I mean less than a quinquagintillion
	var SmallNumericWord = function( num ) {
		var n = new Number(num);
		var expidx = 0;
		n.triplets = toGroups(num, 3).map(function( elem ) {
			var triple = new TripleNumericWord(elem);
			triple.exponential = TripleNumericWord._exponentials[expidx++];
			return triple;
		});
		n.toWords = function() {
			var ret = new Array();
			this.triplets.forEach(function( elem ) {
				var p = [elem.toWords()];
				if( elem.exponential != null ) p.push(elem.exponential);
				ret.push(p.join(" "));
			});
			return ret.reverse().join(", ");
		};
		return n;
	}
	SmallNumericWord._exponentials = [null, "quinquagintillion", "sexagintillion", "septuagintillion", "octogintillion", "nonagintillion", "centillion", "uncentillion", "duocentillion"];

	var NumericWord = function( num ) {
		var n = new Number(num);
		var expidx = 0;
		n.groups = toGroups(num, 30).map(function( elem ) {
			elem = new SmallNumericWord(elem);
			elem.exponential = SmallNumericWord._exponentials[expidx++];
			return elem;
		});
		n.toWords = function() {
			var ret = new Array();
			this.groups.forEach(function( elem ) {
				var p = [elem.toWords()];
				if( elem.exponential != null ) p.push(elem.exponential);
				ret.push(p.join(" "));
			});
			return ret.reverse().join(", ");
		};
		return n;
	}

	// TODO: With very large numbers, javascript converts them to exponential
	// format.  The only way I can think of to fix that is to not use strings
	// internally.
	var t = new NumericWord(this.toFixed());
	var w = t.toWords();
	return w;
};

/*
function assertEq( b, exp ) {
	if( b != exp ) throw '"' + b + '" != "' + exp + '"';
};

assertEq(new Number(0).toWords(), "zero");
assertEq(new Number(1).toWords(), "one");
assertEq(new Number(10).toWords(), "ten");
assertEq(new Number(12).toWords(), "twelve");
assertEq(new Number(20).toWords(), "twenty");
assertEq(new Number(21).toWords(), "twenty one");
assertEq(new Number(100).toWords(), "one hundred");
assertEq(new Number(999).toWords(), "nine hundred and ninety nine");
assertEq(new Number(505).toWords(), "five hundred and five");
assertEq(new Number(111).toWords(), "one hundred and eleven");
assertEq(new Number(106).toWords(), "one hundred and six");
assertEq(new Number(521121).toWords(), "five hundred and twenty one thousand, one hundred and twenty one");
assertEq(new Number(610521121).toWords(), "six hundred and ten million, five hundred and twenty one thousand, one hundred and twenty one");
assertEq(new Number(7401234123145).toWords(), "seven trillion, four hundred and one billion, two hundred and thirty four million, one hundred and twenty three thousand, one hundred and fourty five");
//assertEq(new Number(1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000).toWords(), "one quinquagintillion");
console.log("All tests passed!");
*/
