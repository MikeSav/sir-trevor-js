/*
  Simple Table
*/

SirTrevor.Blocks.Table = (function() {

  var template =  '<table>' +
                    '<caption contenteditable></caption>' +
                    '<thead>' +
                      '<tr>' +
                        '<th contenteditable></th>' +
                        '<th contenteditable></th>' +
                      '</tr>' +
                    '</thead>' +
                  '<tbody>' +
                    '<tr>' +
                        '<td contenteditable></td>' +
                        '<td contenteditable></td>' +
                      '</tr>' +
                    '</tbody>' +
                  '</table>';

  function addCell(row, cellTag) {
    var tag_template = _.template("<<%= tag %>>")
    if (cellTag === undefined) {
      cellTag = tag_template(
        { tag: $(row).children().first().prop('tagName').toLowerCase() }
      );
    }
    $(row).append($(cellTag, {contenteditable: true}));
  };

  function addColumnHandler(ev) {
    ev.preventDefault();
    this.$table.find('tr').each(function () { addCell(this); });
  };

  function deleteColumnHandler(ev) {
    ev.preventDefault();
    this.$table.find('tr').each(function () {
      if ($(this).children().length > 1) {
          $(this).children().last().remove();
      }
    });
  };

  function addRowHandler(ev) {
    var row = $("<tr>");
    ev.preventDefault();
    this.$table.find('th').each(function () {
        addCell(row, "<td>");
    });
    this.$table.find('tbody').append(row);
  };

  function deleteRowHandler(ev) {
    ev.preventDefault();
    if (this.$table.find('tbody tr').length > 1) {
      this.$table.find('tbody tr:last').remove();
    }
  };

  return SirTrevor.Block.extend({

    type: 'table',
    title: function() { return i18n.t('blocks:table:title'); },

    controllable: true,
    controls: {
      'addrow': addRowHandler,
      'delrow': deleteRowHandler,
      'addcol': addColumnHandler,
      'delcol': deleteColumnHandler
    },

    icon_name: 'table',

    editorHTML: function() {
      var editor_template = '<div class="st-text-block">' + template + '</div>';
      return _.template(editor_template, this);
    },

    onBlockRender: function() {
      this.$table = this.getTextBlock().find('table');
    },

    loadData: function(data){
      this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
    },

    toMarkdown: function(html) {
      function rowToMarkdown(row) {
        var cells = $(row).children(),
            md = cells.map(function() { return $(this).text(); })
                .get().join(" | ");
        if (cells[0].tagName === 'TH') {
          md += "\n";
          md += cells.map(function() { return "---"; }).get().join(" | ");
        }
        return md;
      }

      var markdown = $(html).find('tr').map(function(){
        return rowToMarkdown(this);
      }).get().join("\n");
      if ($(html).find('caption').text() != "") {
        markdown += "\n[" + $(html).find('caption').text() + "]";
      }
      return markdown;
    },

    toHTML: function(markdown) {
      var html = $('<table><caption contenteditable></caption><thead><tr></tr></thead><tbody></tbody></table>'),
          lines = markdown.split("\n"),
          caption_re = /\[(.*)\]/,
          lastline;
      // Check for caption
      lastline = lines[lines.length-1];
      if (lastline.match(caption_re)) {
        html.find('caption').text(lastline.match(caption_re)[1]);
        lines = lines.slice(0, lines.length-1);
      }
      // Add header row
      _.each(lines[0].split(" | "), function(content) {
        html.find('thead tr').append('<th contenteditable>' + content + '</th>');
      });
      // Add remaining rows
      _.each(lines.slice(2, lines.length), function(line) {
        var row = $('<tr>');
        _.each(line.split(" | "), function(content) {
          row.append('<td contenteditable>' + content + '</th>');
        });
        html.find('tbody').append(row);
      });
      return html[0].outerHTML;
    },

    isEmpty: function() {
      return _.isEmpty(this.saveAndGetData().text);
    }
  });
})();
