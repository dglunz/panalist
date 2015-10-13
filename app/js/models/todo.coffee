class Todo extends Backbone.Model
  defaults:
    title: ""
    done: false
  check: ->
    @.save({done: !@.get('done')})

