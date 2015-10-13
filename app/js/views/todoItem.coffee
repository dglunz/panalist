class TodoView extends Backbone.Marionette.ItemView
  template: '#todo-view'
  tagName: 'li'
  className: 'collection-item'
  ui:
    title: '.title'
    edit: '.edit'
  events:
    'click .remove':'clear'
    'click .check':'check'
    'click .edit':'edit'
    'dblclick .title':'edit'
    'blur .title':'editSave'
    'keypress .title':'onKeypress'
  edit: ->
    @.ui.edit.text 'save'
    @.ui.edit.removeClass 'edit'
    @.ui.title.attr 'contentEditable', true
    @.ui.title.focus()
  editSave: ->
    todoTitle = @.ui.title.text().trim()
    @.ui.title.text todoTitle
    @.ui.title.attr 'contentEditable', false
    @.ui.edit.text 'edit'
    @.model.set('title', todoTitle).save() if todoTitle
    @.ui.edit.addClass 'edit'
  onKeypress: (evt) ->
    if evt.which == 13
      @.ui.title.blur()
  clear: ->
    @.model.destroy()
  check: ->
    @.model.check()
    if @.model.get 'done'
      todosView.collection.remove @.model
      donesView.collection.add @.model
    else
      donesView.collection.remove @.model
      todosView.collection.add @.model
  templateHelpers: ->
    uniqId: _.uniqueId()
    checked: "checked" if @.model.get('done')


