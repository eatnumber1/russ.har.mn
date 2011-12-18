test("numbers-toWord-0", function() {
	equal(new Number(0).toWords(), "zero");
});
test("numbers-toWord-1", function() {
	equal(new Number(1).toWords(), "one");
});
test("numbers-toWord-10", function() {
	equal(new Number(10).toWords(), "ten");
});
test("numbers-toWord-12", function() {
	equal(new Number(12).toWords(), "twelve");
});
test("numbers-toWord-20", function() {
	equal(new Number(20).toWords(), "twenty");
});
test("numbers-toWord-21", function() {
	equal(new Number(21).toWords(), "twenty one");
});
test("numbers-toWord-100", function() {
	equal(new Number(100).toWords(), "one hundred");
});
test("numbers-toWord-999", function() {
	equal(new Number(999).toWords(), "nine hundred and ninety nine");
});
test("numbers-toWord-505", function() {
	equal(new Number(505).toWords(), "five hundred and five");
});
test("numbers-toWord-111", function() {
	equal(new Number(111).toWords(), "one hundred and eleven");
});
test("numbers-toWord-106", function() {
	equal(new Number(106).toWords(), "one hundred and six");
});
test("numbers-toWord-521121", function() {
	equal(new Number(521121).toWords(), "five hundred and twenty one thousand, one hundred and twenty one");
});
test("numbers-toWord-610521121", function() {
	equal(new Number(610521121).toWords(), "six hundred and ten million, five hundred and twenty one thousand, one hundred and twenty one");
});
test("numbers-toWord-7401234123145", function() {
	equal(new Number(7401234123145).toWords(), "seven trillion, four hundred and one billion, two hundred and thirty four million, one hundred and twenty three thousand, one hundred and fourty five");
});
