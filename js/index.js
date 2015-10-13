var Panalist, Todo, TodoLayout, TodoView, Todos, TodosView, allTodos, donesView, todosView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Todo = (function(superClass) {
  extend(Todo, superClass);

  function Todo() {
    return Todo.__super__.constructor.apply(this, arguments);
  }

  Todo.prototype.defaults = {
    title: "",
    done: false
  };

  Todo.prototype.check = function() {
    return this.save({
      done: !this.get('done')
    });
  };

  return Todo;

})(Backbone.Model);

Todos = (function(superClass) {
  extend(Todos, superClass);

  function Todos() {
    return Todos.__super__.constructor.apply(this, arguments);
  }

  Todos.prototype.localStorage = new Backbone.LocalStorage('todos-backbone');

  Todos.prototype.model = Todo;

  Todos.prototype.byDone = function(bool) {
    var filtered;
    filtered = this.filter(function(todo) {
      return todo.get('done') === bool;
    });
    return new Todos(filtered);
  };

  return Todos;

})(Backbone.Collection);

TodosView = (function(superClass) {
  extend(TodosView, superClass);

  function TodosView() {
    return TodosView.__super__.constructor.apply(this, arguments);
  }

  TodosView.prototype.tagName = 'ul';

  TodosView.prototype.className = 'collection';

  TodosView.prototype.childView = TodoView;

  return TodosView;

})(Backbone.Marionette.CollectionView);

TodoView = (function(superClass) {
  extend(TodoView, superClass);

  function TodoView() {
    return TodoView.__super__.constructor.apply(this, arguments);
  }

  TodoView.prototype.template = '#todo-view';

  TodoView.prototype.tagName = 'li';

  TodoView.prototype.className = 'collection-item';

  TodoView.prototype.ui = {
    title: '.title',
    edit: '.edit'
  };

  TodoView.prototype.events = {
    'click .remove': 'clear',
    'click .check': 'check',
    'click .edit': 'edit',
    'dblclick .title': 'edit',
    'blur .title': 'editSave',
    'keypress .title': 'onKeypress'
  };

  TodoView.prototype.edit = function() {
    this.ui.edit.text('save');
    this.ui.edit.removeClass('edit');
    this.ui.title.attr('contentEditable', true);
    return this.ui.title.focus();
  };

  TodoView.prototype.editSave = function() {
    var todoTitle;
    todoTitle = this.ui.title.text().trim();
    this.ui.title.text(todoTitle);
    this.ui.title.attr('contentEditable', false);
    this.ui.edit.text('edit');
    if (todoTitle) {
      this.model.set('title', todoTitle).save();
    }
    return this.ui.edit.addClass('edit');
  };

  TodoView.prototype.onKeypress = function(evt) {
    if (evt.which === 13) {
      return this.ui.title.blur();
    }
  };

  TodoView.prototype.clear = function() {
    return this.model.destroy();
  };

  TodoView.prototype.check = function() {
    this.model.check();
    if (this.model.get('done')) {
      todosView.collection.remove(this.model);
      return donesView.collection.add(this.model);
    } else {
      donesView.collection.remove(this.model);
      return todosView.collection.add(this.model);
    }
  };

  TodoView.prototype.templateHelpers = function() {
    return {
      uniqId: _.uniqueId(),
      checked: this.model.get('done') ? "checked" : void 0
    };
  };

  return TodoView;

})(Backbone.Marionette.ItemView);

TodoLayout = (function(superClass) {
  extend(TodoLayout, superClass);

  function TodoLayout() {
    return TodoLayout.__super__.constructor.apply(this, arguments);
  }

  TodoLayout.prototype.template = '#todos-layout';

  TodoLayout.prototype.regions = {
    'TodoRegion': '#todo',
    'DoneRegion': '#done'
  };

  TodoLayout.prototype.ui = {
    input: '#new-todo'
  };

  TodoLayout.prototype.onRender = function() {
    this.TodoRegion.show(todosView);
    return this.DoneRegion.show(donesView);
  };

  TodoLayout.prototype.events = {
    'keypress #new-todo': 'onKeypress'
  };

  TodoLayout.prototype.onKeypress = function(evt) {
    var ENTER, todoTitle;
    ENTER = 13;
    todoTitle = this.ui.input.val().trim();
    if (evt.which === ENTER && todoTitle) {
      todosView.collection.create({
        title: todoTitle
      });
      return this.ui.input.val('');
    }
  };

  return TodoLayout;

})(Backbone.Marionette.LayoutView);

TodosView = (function(superClass) {
  extend(TodosView, superClass);

  function TodosView() {
    return TodosView.__super__.constructor.apply(this, arguments);
  }

  TodosView.prototype.tagName = 'ul';

  TodosView.prototype.className = 'collection';

  TodosView.prototype.childView = TodoView;

  return TodosView;

})(Backbone.Marionette.CollectionView);

allTodos = new Todos();

allTodos.fetch();

donesView = new TodosView({
  collection: allTodos.byDone(true)
});

todosView = new TodosView({
  collection: allTodos.byDone(false)
});

Panalist = new Backbone.Marionette.Application();

Panalist.addRegions({
  app: '#app'
});

Panalist.on('start', function() {
  Backbone.history.start();
  return this.app.show(new TodoLayout);
});

$(function() {
  return Panalist.start();
});
