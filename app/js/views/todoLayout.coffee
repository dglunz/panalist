class TodoLayout extends Backbone.Marionette.LayoutView
  template: '#todos-layout'
  regions:
    'TodoRegion': '#todo'
    'DoneRegion': '#done'
  ui:
    input: '#new-todo'
  onRender: ->
    @.TodoRegion.show todosView
    @.DoneRegion.show donesView
  events:
    'keypress #new-todo':'onKeypress'
  onKeypress: (evt) ->
    ENTER = 13
    todoTitle = @.ui.input.val().trim()
    if evt.which == ENTER && todoTitle
      todosView.collection.create
        title: todoTitle
      @.ui.input.val ''


