class Panalist extends Backbone.Marionette.Application
  initialize: =>
    console.log "Initializing Panalist..."

$ ->
  panalist = new Panalist()
  panalist.start()
