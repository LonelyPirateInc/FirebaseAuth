angular.module('app.controllers', [])

.controller('loginCtrl', ['$scope', '$stateParams', '$state', function ($scope, $stateParams, $state) {
  $scope.user = {
    email: "",
    password: ""
  };
  $scope.auth = function () {
    const promise = firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password);
    promise.catch(e => console.log(e.message));

  };

  var loginUserAuth = firebase.auth();

  loginUserAuth.onAuthStateChanged(firebase_user => {
    if (firebase_user && firebase_user.emailVerified) {
      console.log(firebase_user);
      $state.go('myTrips');
    } else if (firebase_user.emailVerified == false) {
      console.log("Email NOT verified, please verify your email");
    } else {
      console.log(firebase_user);
    }
  });
}])

.controller('signupCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {

  var database = firebase.database();

  $scope.new_user = {
    first_name: "",
    last_name: "",
    employee_number: "",
    email: "",
    password: ""
  };

  $scope.createUser = function () {
    // TODO: Check for real email
    const promise = firebase.auth().createUserWithEmailAndPassword($scope.new_user.email, $scope.new_user.password);
    promise.catch(e => console.log(e.message));

    createUserAuth = firebase.auth();
    createUserAuth.onAuthStateChanged(firebase_user => {
      if (firebase_user) {
        firebase_user.sendEmailVerification().then(function () {
          console.log("Email was sent");
          writeUserData($scope.new_user.employee_number, $scope.new_user.first_name, $scope.new_user.last_name, $scope.new_user.email, $scope.new_user.password);
        }, function (error) {
          console.log("Error", error);
        })
      }
    });

  };
  // *TODO: Create the user as top hierarchy in the data base portion of fire base 
  // TODO: run this code ONLY after the user logged in for the first time
  // TODO: write an if statement to determine if root 'users' already exist, if not create it and add the user to it
  function writeUserData(en, name, last, email, pswd) {
    firebase.database().ref('Users/' + en).set({
      username: name,
      email: email,
      password: pswd,
      trips: []
    });
  }
}])

.controller('myTripsCtrl', ['$scope', '$stateParams', '$state', function ($scope, $stateParams, $state) {
  $scope.goToPreApproval = function () {
    $state.go('preApproval');
  };

}])

.controller('preApprovalCtrl', ['$scope', '$stateParams', '$state', function ($scope, $stateParams, $state) {

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
      fare: 0,
      car_rental: 0,
      private_vehicle: 0,
      meals: 0,
      accomodation: 0,
      hospitality: 0,
      incidental: 0,
      total: this.fare + this.car_rental + this.private_vehicle + this.meals + this.accomodation + this.hospitality + this.incidental
    },
    most_efficent_method_of_transportation: "",
    rationale: "",
    non_remote_meeting: "",
    rationale: "",
    more_than_5_ccc_travellers: "",
    rationale: ""
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

