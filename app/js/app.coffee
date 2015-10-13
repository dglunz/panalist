# Globals for simplicity
allTodos = new Todos()
allTodos.fetch()
donesView = new TodosView
  collection: allTodos.byDone(true)
todosView = new TodosView
  collection: allTodos.byDone(false)

Panalist = new Backbone.Marionette.Application()

Panalist.addRegions
  app: '#app'

Panalist.on 'start', ->
  Backbone.history.start()
  @.app.show new TodoLayout

$ ->
  Panalist.start()
