# (The MIT License)
# 
# Copyright © 2012-2013 Felix Ren-Chyan Chern
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the ‘Software’), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
# of the Software, and to permit persons to whom the Software is furnished to do
# so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# Modified from https://raw.github.com/dryman/dryman.github.com/src/plugins/graphviz_block.rb

GRAPHVIZ_DIR = File.expand_path('../../source/images/graphviz', __FILE__)
FileUtils.mkdir_p(GRAPHVIZ_DIR)

module Jekyll
  class GraphvizBlock < Liquid::Raw
    def render(context)
      code = super(context)
      destination = File.join(
        context.registers[:site].config["destination"],
        "images/graphviz"
      )
      FileUtils.mkdir_p(destination) unless Dir.exists? destination
      svg_name = "g-#{Digest::MD5.hexdigest(code)}.svg"
      svg = File.join(destination, svg_name)
      puts "dot -Tsvg -o #{svg}"
      IO.popen("dot -Tsvg -o #{svg}", 'a') do |pipe|
        pipe.puts(code)
        pipe.close_write
      end
      #svg = svg.lines.to_a[3..-1].join # Strip off the first two lines (doctype)
      #svg
      web_svg = "/images/graphviz/#{svg_name}"
      "<embed class='graphviz' src='#{web_svg}' type='image/svg+xml' />"
    end
  end
end

Liquid::Template.register_tag('graphviz', Jekyll::GraphvizBlock)
