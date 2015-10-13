class Todos extends Backbone.Collection
  initialize: ->
    @.add title: "Figure"
    @.add title: "This"
    @.add title: "Shit"
    @.add title: "Out"
  model: Todo
