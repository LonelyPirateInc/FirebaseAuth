angular.module('app.controllers', [])

  .controller('loginCtrl', ['$scope', '$stateParams', '$state', 'UserEmailService', '$firebaseAuth', function ($scope, $stateParams, $state, UserEmailService, $firebaseAuth) {
    // User object
    $scope.user = {
      email: "",
      password: ""
    };
    // $FirebaseAuth reference 
    var auth = $firebaseAuth();

    // login method, runs when user click on login button
    $scope.login = function () {
      // Firebase built method, signing with email and password , returns firebaseUser object if success 
      auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password).then(function (firebaseUser) {
        // Verification if we got firebaseUser back and the user verified his account with the email-verification
        if (firebaseUser && firebaseUser.emailVerified) {
          // store the email of the returned firebaseUser object in the factory 
          UserEmailService.setEmail(firebaseUser.email);
          // move to a different state 
          $state.go('myTrips');
        } else {
          console.log("Email NOT verified, please verify your email");
        }
      }).catch(function (error) {
        console.log("Authentication failed:", error);
      });
    };
  }])

  .controller('signupCtrl', ['$scope', '$stateParams', '$state', '$firebaseObject', '$firebaseAuth', 'ProfileFactory', 'CheckForUsersChildFactory', function ($scope, $stateParams, $state, $firebaseObject, $firebaseAuth, ProfileFactory, CheckForUsersChildFactory) {

    // $FirebaseAuth reference 
    var auth = $firebaseAuth();
    // var ref = firebase.database().ref();
    // Download the database data into a local object $scope.data
    // the line of code below, $scope.data is going to be populated from the remote server. This is an asynchronous call, so it will take some time before the data becomes available in the controller.
    // While it might be tempting to put a console.log on the next line to read the results, the data won't be downloaded yet, so the object will appear to be empty. 
    // $scope.data = $firebaseObject(ref);
    // using '$loaded()' to wait for data to populate '$scope.data' before 'console.log' it 
    // $scope.data.$loaded()
    // .then(function() {
    //   console.log($scope.data);
    // })
    // .catch(function(err) {
    //   console.error(err);
    // });
    // var database = firebase.database();

    $scope.newProfile = {
      first_name: "",
      last_name: "",
      employee_number: "",
      email: "",
      password: ""
    };


    $scope.isUsersChildExists;
    // TODO: Check for real email

    var ref = firebase.database().ref();
    $scope.newProfile = $firebaseObject(ref.child("users"));
    console.log($scope.newProfile);

    $scope.createProfileInDataBase = function () {
      var ref = firebase.database().ref();
      var obj = $firebaseObject(ref);
      var exists;

      /***  Write a Factory for this block of code */
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
        if (exists) {
          console.log("here");
          // calling $save() on the synchronized object syncs all data back to our database
          $scope.newProfile.$save().then(function (data) {
            console.log(data);
            alert('Profile saved!');
            $scope.createProfileInAuthentication();
            $state.go('login');
          }).catch(function (error) {
            console.log(error);
            alert('Error!');
          });
        }
      })
      /********************************************************/
    }
    $scope.createProfileInAuthentication = function () {
      // Creating the user in the Authentication portion of the firebase Database 
      auth.$createUserWithEmailAndPassword($scope.newProfile.email, $scope.newProfile.password)
        .then(function (firebaseUser) {
          console.log("created user in the Authentication base");
          // Sending confirmation email to the user 
          firebaseUser.sendEmailVerification();
          console.log("Email was sent");
          // $scope.message = "User created with uid: " + firebaseUser.uid;
        }).catch(function (error) {
          console.log(error);
        });
    }
    // *TODO: Create the user as top hierarchy in the data base portion of fire base 
    // TODO: run this code ONLY after the user logged in for the first time
    // TODO: write an if statement to determine if root 'users' already exist, if not create it and add the user to it
  }])

  .controller('myTripsCtrl', ['$scope', '$stateParams', '$state', function ($scope, $stateParams, $state) {
    $scope.goToPreApproval = function () {
      $state.go('preApproval');
    };

  }])

  .controller('preApprovalCtrl', ['$scope', '$stateParams', '$state', 'UserEmailService', function ($scope, $stateParams, $state, UserEmailService) {

    // TODO: FIX ACCIDENTIAL PAGE ROUTING AND NAVIGATION
    // TODO: Format $scope.itinerary arrival and departure times to the proper format 




    $scope.itinerary = {
      arrival: "",
      departure: "",
      class: "",
      accomodations: ""
    }

    $scope.pre_approval_form = {
      trip_approval_number: "",
      purpose: "",
      work_orders: {
        work_order_number: "",
        recoverable: false,
        rc_charged: "",
        business_rationale: ""
      },
      itineraries: [],
      trip_budget: {
        fare: "",
        car_rental: "",
        private_vehicle: "",
        meals: "",
        accomodation: "",
        hospitality: "",
        incidental: "",
        total: 0
      },
      most_efficent_method_of_transportation: false,
      most_efficent_method_of_transportation_rationale: "",
      non_remote_meeting: false,
      non_remote_meeting_rationale: "",
      more_than_5_ccc_travellers: false,
      more_than_5_ccc_travellers_rationale: ""
    }


    // TODO: Make sure the cents are included in the calculation 
    $scope.calculateTotal = function (input_expense) {


      $scope.pre_approval_form.trip_budget.total = 0;

      for (expense in $scope.pre_approval_form.trip_budget) {
        console.log(expense);
        console.log($scope.pre_approval_form.trip_budget[expense]);

        if (isNaN(parseInt($scope.pre_approval_form.trip_budget[expense])) || expense == "total") {
          console.log("insdie the isnan");
        } else {
          $scope.pre_approval_form.trip_budget.total += parseInt($scope.pre_approval_form.trip_budget[expense]);
        }
      }


    }

    $scope.submitForm = function () {
      // console.log(firebase.auth().currentUser.getToken());
      //  console.log(firebase.database().ref('Users'));


      var user_email = UserEmailService.getEmail();
      console.log(user_email);
      var starCountRef = firebase.database().ref('Users');
      starCountRef.on('value', function (snapshot) {
        var users = snapshot.val();
        console.log(users);
        for (user in users) {
          if (user_email == users[user].email) {
            $scope.uploadToFireBase(user);
          }
        }

      });


      $scope.uploadToFireBase = function (user_id) {

        firebase.database().ref('Users/' + user_id + '/' + 'trips').set({
          user_id: $scope.pre_approval_form
        });
        console.log("uploaded");
      }
    }

    // TODO: add confirmation field for Business Rationale - Other 

    $scope.cancel = function () {
      $state.go('myTrips')
    }
    $scope.cards = false;

    $scope.addItinerary = function () {
      $scope.cards = true;
    }

    $scope.saveItinerary = function () {
      // TODO: pop-up with check mark for itinerary saved
      $scope.cards = false;
      $scope.pre_approval_form.itineraries.push($scope.itinerary);
      console.log($scope.pre_approval_form.itineraries);
    }

  }])
