var doteApp = angular.module("doteApp", [
    'ngRoute',
    'highcharts-ng'
]);

doteApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/', {

        templateUrl: 'home.html',
        controller: 'HomeController'

    });

    $routeProvider.when('/hero/:heroTag', {

        templateUrl: 'hero.html',
        controller: 'HeroController'

    });

    $routeProvider.when('/skill/:skillTag', {

        templateUrl: 'skill.html',
        controller: 'SkillController'

    });

    $routeProvider.when('/stats/:statTag', {

        templateUrl: 'stats.html',
        controller: 'StatsController'

    });

    $routeProvider.when('/stats/', {

        templateUrl: 'stats.html',
        controller: 'StatsController'

    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });

}]);

doteApp.controller("MainController", ["$scope", "$route", "doteApi", function($scope, $route, doteApi) {

    $scope.loading = true;
    $scope.breadcrumbs = [];

    doteApi.onLoadingFinished = function() {

        setTimeout(function() {
            $scope.loading = false;
            $route.reload();
        }, 150);
    }

    $scope.setTitle = function(title) {
        var prefix = "DotE Database";

        if (title == undefined) {

            document.title = prefix;

        } else {

            document.title = prefix + " - " + title;

        }
    }

    $scope.setBreadcrumbs = function(breadcrumbs) {

        $scope.breadcrumbs = breadcrumbs;

    }

    doteApi.fetch();

}]);

doteApp.controller("HomeController", ["$scope", "doteApi", function($scope, doteApi) {

    $scope.api = doteApi;
    $scope.searchTerm = "";

    $scope.heroesResults = doteApi.getHeroes();
    $scope.activeSkillsResults = doteApi.getActiveSkills();
    $scope.passiveSkillsResults = doteApi.getPassiveSkills();

    $scope.onSearchTermChange = function() {

        $scope.heroesResults = $scope.getSearchedHeroes();
        $scope.activeSkillsResults = $scope.getSearchedActiveSkills();
        $scope.passiveSkillsResults = $scope.getSearchedPassiveSkills();

    };

    $scope.getSearchedHeroes = function() {
        return grep(doteApi.getHeroes(), function(hero) {
            return (hero.name.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) > -1);
        });
    };

    $scope.getSearchedActiveSkills = function() {
        return grep(doteApi.getActiveSkills(), function(skill) {
            return (skill.name.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) > -1);
        });
    };

    $scope.getSearchedPassiveSkills = function() {
        return grep(doteApi.getPassiveSkills(), function(skill) {
            return (skill.name.toLowerCase().indexOf($scope.searchTerm.toLowerCase()) > -1);
        });
    };

    $scope.contains = function(haystack, needle) {

        return contains(haystack, needle);

    };

    $scope.$parent.setTitle("Home");
    $scope.$parent.setBreadcrumbs(["Home"]);

}]);


doteApp.controller("HeroController", ["$scope", "$routeParams", "doteApi" ,function($scope, $routeParams, doteApi) {
    $scope.api = doteApi;
    $scope.hero = doteApi.getHeroByTag($routeParams.heroTag);

    $scope.$parent.setTitle($scope.hero.name);

}]);

doteApp.controller("SkillController", ["$scope", "$routeParams", "doteApi", function($scope, $routeParams, doteApi) {

    $scope.api = doteApi;
    $scope.skill = doteApi.getSkillByTag($routeParams.skillTag);

    $scope.heroSkillEntries = doteApi.getHeroesWhoUnlocksSkill($scope.skill);

    $scope.$parent.setTitle($scope.skill.name);

}]);

doteApp.controller("StatsController", ["$scope", "$routeParams", "doteApi", function($scope, $routeParams, doteApi) {

    $scope.api = doteApi;

    var chosenStat = doteApi.getStat("defense");
    var index = chosenStat.index;

    var series = [];

    // We fetch the stats from the character
    doteApi.getHeroes().forEach(function(hero) {

        series.push({
            name: hero.name,
            data: doteApi.getStatColumn(hero, index)
        });

    });

    $scope.chartConfig = {

        options: {

            chart: {
                type: "line"
            }

        },

        title: {
            text: null
        },

        xAxis: {
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        },

        yAxis: {
            title: {
                text: null
            },
            min: 0
        },

        series: series
    };


}]);

doteApp.factory("doteApi", ["$http", function($http) {

    var service = {};
    var heroes = [];
    var skills = [];
    var stats = [];
    var maxLevel = 15;

    service.onLoadingFinished = function() {};

    service.fetch = function() {

        var httpHeroResponse = $http.get("/data/heroes.json");
        var httpSkillResponse = $http.get("/data/skills.json");
        var httpStatsResponse = $http.get("/data/stats.json");

        httpHeroResponse.success(function(data, status) {

            heroes = data.heroes;

            httpSkillResponse.success(function(data, status) {

                skills = data.skills;

                // Preload images
                heroes.forEach(function(hero) {
                    var img = new Image();
                    img.src = "/img/hero/" + hero.tag + ".png";
                });
                skills.active.concat(skills.passive).forEach(function(skill) {
                    var img = new Image();
                    img.src = "/img/skill/" + skill.tag + ".png";
                });

                httpStatsResponse.success(function(data, status) {

                    stats = data.stats;

                    service.onLoadingFinished();

                });

            });
        });

        httpHeroResponse.error(function(data, stauts) {

            console.log("Error heroes.json " + status);

        });

        httpHeroResponse.error(function(data, stauts) {

            console.log("Error skills.json " + status);

        });

    };

    service.getHeroes = function() {
        return heroes;
    };

    service.getHeroByTag = function(tag) {

        return grepOnlyOne(heroes, function(hero) {
            return hero.tag == tag;
        });

    };

    service.getMaxlevel = function() {
        return maxLevel;
    };

    service.getLevels = function() {
        var levels = [];
        for (var i = 1;i <= service.getMaxlevel();i++)
            levels.push(i);

        return levels;
    }

    service.getSkillByTag = function(tag) {

        return grepOnlyOne(skills.active.concat(skills.passive), function(skill) {
            return skill.tag == tag;
        });

    }

    service.getActiveSkills = function() {
        return skills.active;
    };

    service.getPassiveSkills = function() {
        return skills.passive;
    }

    service.getUnlockSkills = function(character, level) {

        var skillEntries = grep(character.skills, function(skillEntry) {
            return skillEntry.level == level;
        });

        var skills = skillEntries.map(function(skillEntry) {
            return service.getSkillByTag(skillEntry.skillTag);
        });

        return skills;

    };

    service.getHeroesWhoUnlocksSkill = function(skill) {

        var entries = [];

        for (var i = 0;i < heroes.length;i++) {
            var hero = heroes[i];

            for (var j = 0;j < hero.skills.length;j++) {
                var skillEntry = hero.skills[j];

                if (skillEntry.skillTag == skill.tag) {

                    entries.push({
                        hero: hero,
                        level: skillEntry.level
                    });

                }

            }

        }

        entries = entries.sort(function(skillEntryA, skillEntryB) {

            if (skillEntryA.hero.tag != skillEntryB.hero.tag)
                return skillEntryA.hero.tag - skillEntryB.hero.tag;
            else
                return skillEntryA.level - skillEntryB.level;

        });

        return entries;

    };

    service.isSkillActive = function(skill) {
        return ("duration" in skill);
    };

    service.getStats = function() {
        return service.stats;
    };

    service.getStat = function(statTag) {

        return grepOnlyOne(stats, function(stat) {
            return stat.tag == statTag;
        });

    };

    service.getStatColumn = function(hero, index) {

        var statColumn = [];

        hero.stats.forEach(function(statRow) {

            statColumn.push(statRow[index]);

        });

        return statColumn;

    }

    return service;

}]);

doteApp.directive("myTooltip", ["$document", function($document) {

    return {
        link: function(scope, element, attrs, tabsCtrl) {

            var tooltipTrigger = angular.element(element[0].children[0]);
            var tooltip = angular.element(element[0].children[1]);

            tooltip.addClass("tooltip-hidden");

            var mouseMove = function (event) {

                tooltip.css({
                    top: event.pageY,
                    left: event.pageX + 15
                });

            };

            element.on("mouseenter", function (event) {

                tooltip.removeClass("tooltip-hidden");
                $document.on("mousemove", mouseMove);

            });

            element.on("mouseleave", function (event) {

                tooltip.addClass("tooltip-hidden");
                $document.off("mousemove", mouseMove);

            });

        }
    };
}]);
