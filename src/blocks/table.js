/*
  Simple Table
*/

SirTrevor.Blocks.Table = (function() {

  var template =  '<table>' +
                    '<thead>' +
                      '<tr>' +
                        '<th contenteditable="true"></th>' +
                        '<th contenteditable="true"></th>' +
                      '</tr>' +
                    '</thead>' +
                  '<tbody>' +
                    '<tr>' +
                        '<td contenteditable="true"></td>' +
                        '<td contenteditable="true"></td>' +
                      '</tr>' +
                    '</tbody>' +
                  '</table>';

  function addCell(cellTag) {
    if (cellTag === undefined) {
      tag_template = _.template("<<%= tag %>>")
      cellTag = tag_template(
        { tag: $(this).children().first().prop('tagName').toLowerCase() }
      );
    }
    $(this).append($(cellTag, {contenteditable: true}));
  };

  function addColumnHandler(ev) {
    ev.preventDefault();
    this.getTable().find('tr').each(function () { _.bind(addCell, this)(); });
  };

  function deleteColumnHandler(ev) {
    ev.preventDefault();
    this.getTable().find('tr').each(function () {
      if ($(this).children().length > 1) {
          $(this).children().last().remove();
      }
    });
  };

  function addRowHandler(ev) {
    ev.preventDefault();
    row = $("<tr>");
    this.getTable().find('th').each(function () {
        _.bind(addCell, row)("<td>");
    });
    this.getTable().find('tbody').append(row);
  };

  function deleteRowHandler(ev) {
    ev.preventDefault();
    if (this.getTable().find('tbody tr').length > 1) {
      this.getTable().find('tbody tr:last').remove();
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

    getTable: function() {
      return this.getTextBlock().find('table');
    },

    editorHTML: function() {
      editor_template = '<div class="st-text-block st-required">' + template + '</div>';
      return _.template(editor_template, this);
    },

    loadData: function(data){
      // TODO: Implement
      //this.getTextBlock().html("<ul>" + SirTrevor.toHTML(data.text, this.type) + "</ul>");
    },

    toMarkdown: function(markdown) {
      // TODO: Implement
      //return markdown.replace(/<\/li>/mg,"\n")
      //               .replace(/<\/?[^>]+(>|$)/g, "")
      //               .replace(/^(.+)$/mg," - $1");
      return markdown;
    },

    toHTML: function(html) {
      // TODO: Implement
      //html = html.replace(/^ - (.+)$/mg,"<li>$1</li>")
      //           .replace(/\n/mg, "");
      return html;
    },

    isEmpty: function() {
      return _.isEmpty(this.saveAndGetData().text);
    }
  });
})();
