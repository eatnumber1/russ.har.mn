SVG_FILES := example1.svg example2.svg example3.svg

.PHONY: all clean

all: $(SVG_FILES)

clean:
	$(RM) $(SVG_FILES)

%.svg: %.dot
	dot -o$@ -Tsvg $<

