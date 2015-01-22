// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('toEat', ['ionic'])

.factory('Days', function() {
  return {
    all: function() {
      var dayString = window.localStorage['days'];
      if(dayString) {
        // return angular.fromJson(dayString);
        return [];
      }
      return [];
    },
    save: function(days) {
      window.localStorage['days'] = angular.toJson(days);
    },
    newDay: function(dayDate, tasksNum) {
      return {
        date: dayDate,
        numOfTasks: tasksNum,
        tasks: []
      }
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveDay']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveDay'] = index;
    }
  }
})

.controller('ToeatCtrl', function($scope, $timeout, $ionicModal, Days, $ionicSideMenuDelegate, $element) {

  // creates and saves a day
  $scope.createDay = function(tempDay) {
    dayTitle = tempDay.title;
    tasksNum = tempDay.num;
    var newDay = Days.newDay(dayTitle, tasksNum);
    $scope.days.push(newDay);
    Days.save($scope.days);
    $scope.selectDay(newDay, $scope.days.length-1);
    $scope.closeNewDayModal();
  };

  // closes day modal
  $scope.closeNewDayModal = function() {
    $scope.dayModal.hide();
    if($scope.days.length == 0) {
      $ionicSideMenuDelegate.toggleLeft();
    }
  };

  // load or initialize days
  $scope.days = Days.all();

  // grab lastActive or the first day
  $scope.activeDay = $scope.days[Days.getLastActiveIndex()];

  $scope.newDay = function() {
    $scope.dayModal.show()
  }

  // called to select a given day
  $scope.selectDay = function(day, index) {
    $scope.activeDay = day;
    Days.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // create and load the new task modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('new-day.html', function(modal) {
    $scope.dayModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeDay || !task) {
      return;
    }
    $scope.activeDay.tasks.push({
      title: task.title,
      done: false,
      id: $scope.activeDay.tasks.length -1 || 0,
      colour: task.colour
    });
    $scope.taskModal.hide();

    // saves all the days. inefficient: change later
    Days.save($scope.days);

    task.title = "";
  };

  $scope.colours = [
      {name:'#CD5C5C', foodGroup:'meat'},
      {name:'#D2B48C', foodGroup:'grains'},
      {name:'#B0E0E6', foodGroup:'fruit'},
      {name:'#20B2AA', foodGroup:'veggies'},
      {name:'#F0E68C', foodGroup:'sugar/carbs'},
      {name: 'white', foodGroup: 'other'}
    ];

  $scope.completeTask = function(task, e) {
    var elem = angular.element(e.srcElement);
    task.done = !task.done
    Days.save($scope.days);
  };

  // opens task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // closes task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  // toggle days
  $scope.toggleDays = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // uses $timeout so everything can be initialized properly
  $timeout(function() {
    if($scope.days.length == 0) {
      $scope.newDay();
      // while(true) {
      //   $scope.newDay();
      //   // var dayTitle = prompt('Your first date:');
      //   // var tasksNum = '0'; //defaults to unlimited for your first
      //   dayTitle = day.title;
      //   tasksNum = day.num;
      //   if(dayTitle && tasksNum) {
      //     createDay(dayTitle, tasksNum);
      //     break;
      //   }
      // }
    }
  });
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
