(function(Utils){
	
	var app = angular.module("app", []);
	app.controller("ctrl", function($scope, $filter) {

		Utils.loadResource('contact-data.json', function(response){
			$scope.contacts = $filter('orderBy')(JSON.parse(response), 'state');
			
			$scope.refresh = function(pageIndex){
				$scope.currentPageIndex = parseInt(pageIndex) || 0;
				$scope.pageResults = $scope.pageResults || 10;

				if($scope.searchFilter === 'last_name')
					$scope.filteredPaginatedContacts = $filter('filter')($scope.contacts, {'last_name':  $scope.query}).divideArray($scope.pageResults);
				else
					$scope.filteredPaginatedContacts = $filter('filter')($scope.contacts, {'first_name':  $scope.query}).divideArray($scope.pageResults);

				$scope.pageRange = $scope.filteredPaginatedContacts.length.range(1);
				$scope.displayedContacts = $scope.filteredPaginatedContacts[$scope.currentPageIndex];

				angular.element(document).ready(function () {
					var pageButton = document.getElementsByClassName('page-button');
					for(var i=0;i<pageButton.length;i++){
						pageButton[i].style.background = 'linear-gradient(rgb(55,55,55), rgb(222,222,222))';
					}

					if(document.getElementsByClassName('page-'+($scope.currentPageIndex+1)).length > 0)
			        	document.getElementsByClassName('page-'+($scope.currentPageIndex+1))[0].style.background = 'linear-gradient(rgb(1,1,1), rgb(15,15,15))';
			    });
			}

			$scope.refresh();
			$scope.$apply();
		});
	});

})(Utils)
