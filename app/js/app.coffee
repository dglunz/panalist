class Todo extends Backbone.Model
  defaults:
    title: ""
    done: false
    createdAt: ->
      Date.now()
  check: ->
    @.set('done', !@.get('done'))

class Todos extends Backbone.Collection
  model: Todo
  localStorage: new Backbone.LocalStorage 'todos-backbone'
  byDone: (bool) ->
    filtered = @.filter (todo) ->
      todo.get('done') == bool
    new Todos(filtered)

Panalist = new Backbone.Marionette.Application()
todoList = new Todos()

Panalist.addRegions
  header: "#header"
  todo: "#todo"
  done: "#done"

class TodoView extends Backbone.Marionette.ItemView
  template: '#todo-view'
  tagName: 'li'
  className: 'collection-item'
  initialize: (opts) ->
    @.bind(@.model, 'change', @.render, @)
  events:
    'click .remove':'remove'
    'click .check':'check'
  remove: ->
    @.model.destroy()
  check: ->
    @.model.check().save()
  templateHelpers: ->
    uniqId: _.uniqueId()
    checked: "checked" if @.model.get('done')

class TodosView extends Backbone.Marionette.CompositeView
  template: '#todos-view'
  childView: TodoView
  childViewContainer: '#todo-list'

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

Panalist.on 'start', ->
  Backbone.history.start()
  todoList.fetch()
  @.header.show new HeaderView
  @.todo.show new TodosView
    collection: todoList.byDone(false)
  @.done.show new TodosView
    collection: todoList.byDone(true)

$ ->
  Panalist.start()
