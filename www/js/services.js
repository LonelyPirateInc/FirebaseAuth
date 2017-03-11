angular.module('app.services', [])

  .factory('BlankFactory', [function () {

  }])

  .service('UserEmailService', [function () {

    this.userData = {};

    this.setEmail = function (email) {
      this.userData.email = email;
    };

    this.getEmail = function () {
      return this.userData.email;
    };


  }])

  .factory("ProfileFactory", ["$firebaseObject",
    function ($firebaseObject) {
      return function (employee_number) {
        console.log(employee_number);
        // create a reference to the database node where we will store our data
        var ref = firebase.database().ref().push();
        var profileRef = ref.child(employee_number);
        // return it as a synchronized object
        return $firebaseObject(profileRef);
      }
    }
  ])

    .factory("CheckForUsersChildFactory", ["$firebaseObject",
    function ($firebaseObject) {
      return function () {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref();
      var obj = $firebaseObject(ref);
      var exists;

      obj.$loaded(function () {
        console.log("inside the factory");
        console.log(obj);
        if (obj.users != null) {
          console.log("Users child exists");
          exists = true;
          console.log(exists);
        } else {
          console.log("Users child does not exists");
          exists = false;
        };
        // var usersChildExists = obj.$value !== null;
        // console.log(usersChildExists);
        // return usersChildExists;
      });
      return exists;
    }
      }
  ]);

  // .factory("CheckForUsersChildFactory", ["$firebaseObject", function ($firebaseObject) {
  //   return function () {
  //     // create a reference to the database node where we will store our data
  //     var ref = firebase.database().ref();
  //     var obj = $firebaseObject(ref);
  //     var exists;

  //     obj.$loaded(function () {
  //       console.log("inside the factory");
  //       console.log(obj);
  //       if (obj.users != null) {
  //         console.log("Users child exists");
  //         exists = true;
  //         console.log(exists);
  //       } else {
  //         console.log("Users child does not exists");
  //         exists = false;
  //       };
  //       // var usersChildExists = obj.$value !== null;
  //       // console.log(usersChildExists);
  //       // return usersChildExists;
  //     });
  //     return exists;
  //   }
  // }])

  // .factory("CheckForUsersChildFactory", ["$firebaseObject", function ($firebaseObject) {
  //   return {
  //       checkChild: function() {
  //     // create a reference to the database node where we will store our data
  //     var ref = firebase.database().ref();
  //     var obj = $firebaseObject(ref);
  //     var exists;

  //     obj.$loaded(function () {
  //       console.log("inside the factory");
  //       console.log(obj);
  //       if (obj.users != null) {
  //         console.log("Users child exists");
  //         exists = true;
  //         console.log(exists);
  //       } else {
  //         console.log("Users child does not exists");
  //         exists = false;
  //       };
  //       // var usersChildExists = obj.$value !== null;
  //       // console.log(usersChildExists);
  //       // return usersChildExists;
  //     });
  //     return exists;
  //   }
  //   }
