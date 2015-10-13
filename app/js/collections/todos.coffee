class Todos extends Backbone.Collection
  localStorage: new Backbone.LocalStorage 'todos-backbone'
  model: Todo
  byDone: (bool) ->
    filtered = @.filter (todo) ->
      todo.get('done') == bool
    new Todos(filtered)


