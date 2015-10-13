class Todo extends Backbone.Model
  defaults:
    title: ""
    done: false
    createdAt: ->
      Date.now()

class Todos extends Backbone.Collection
  model: Todo
  localStorage: new Backbone.LocalStorage 'todos-backbone'
  initialize: ->
    console.log "Initializing a todo collection"

Panalist = new Backbone.Marionette.Application()
todoList = new Todos()

Panalist.addRegions
  header: "#header"
  main: "#main"

class TodoView extends Backbone.Marionette.ItemView
  template: '#todo-view'
  tagName: 'li'
  className: 'collection-item'
  initialize: (opts) ->
    @.bind(@.model, 'cchange', @.render, @)
    console.log "Initializing individual todo..."
  events:
    'click .remove':'delete'
  delete: ->
    @.model.destroy()

class TodosView extends Backbone.Marionette.CompositeView
  template: '#todos-view'
  childView: TodoView
  childViewContainer: '#todo-list'
  initialize: (opts) ->
    console.log "Initializing todos view..."

class HeaderView extends Backbone.Marionette.ItemView
  template: '#header-view'
  ui:
    input: '#new-todo'
  events:
    'keypress #new-todo':'onKeypress'
  onKeypress: (evt) ->
    ENTER = 13
    todoTitle = @.ui.input.val().trim()
    if evt.which == ENTER && todoTitle
      todoList.create
        title: todoTitle
      @.ui.input.val ''
  initialize: (opts) ->
    console.log "Initializing header view..."

Panalist.on 'start', ->
  Backbone.history.start()
  @.header.show new HeaderView
  @.main.show new TodosView
    collection: todoList
  todoList.fetch()

$ ->
  Panalist.start()
