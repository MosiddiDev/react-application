(function(){
	
	var app = angular.module("studentManagementApp", ['ngMaterial', 'ngMdIcons']);

	app.controller("studentManager", function($scope, $http, $timeout, $mdDialog, $filter) {
		$scope.list_view = 'views/student-list.html'
		$scope.info_view = 'views/student-info.html'
		$scope.form_view = 'views/student-form.html'

		$scope.route = function(view, student){
			$scope.view = view;
			$scope.selectedStudent = student || {};
		}

		$scope.submitData = function(){
			var test = $scope.selectedStudent;
			console.log(test);
			$http.post('/service/'+ ($scope.selectedStudent.id || ''), $scope.selectedStudent);
			$scope.loading = true;
			$scope.route($scope.list_view)
		}

		$scope.deleteStudent = function(ev){
			var confirm = $mdDialog.confirm()
			.parent(angular.element(document.body))
			.title('Delete Confirm')
			.content('Are you sure you want to delete the current student? all recods will be removed!')
			.ariaLabel('Delete Confirm')
			.ok('Delete')
			.cancel('Keep User')
			.targetEvent(ev);
			$mdDialog.show(confirm).then(function(path){
				$http.delete('/service/'+ $scope.selectedStudent.id)
				.success(function (data) {
			     	$scope.students = data;
			     	$scope.loading = true;
			     	$scope.route($scope.list_view)
			     })
			})

		}

		function poolStudentData($scope, $http, $timeout) {
		    $scope.students = [];

		    (function pool() {
		        $http.get('/service/').success(function (data) {
		            $scope.students = $filter('orderBy')(data, 'name');
		            $scope.loading = false;
		            $timeout(pool, 1500);
		        }).error(function () {
					$scope.loading = true;
				})
		    })();
		};

		$scope.route($scope.list_view);
		$scope.loading = true;
		poolStudentData($scope, $http, $timeout);
	});

})()
