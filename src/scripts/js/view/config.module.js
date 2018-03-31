var configModule = angular.module('Optimise.config',['Optimise.view']);

configModule.directive('configEntry', function() {

    function display($scope, element) {

        d3.selectAll("svg").remove();

        var w = window,
            d = document,
            e = d.documentElement,
            g = d3.select(element[0]),
            windowX = w.innerWidth || e.clientWidth || g.clientWidth,
            windowY = w.innerHeight|| e.clientHeight|| g.clientHeight;

        var margin = {top: 20, right: 20, bottom: 20, left: 120},
            width = (0.8*windowX) - margin.left - margin.right,
            height = (0.68*windowY) - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y, d.x]; });

        var svg = d3.select(element[0]).append("svg:svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        root = $scope.configData;
        root.x0 = height / 2;
        root.y0 = 0;

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        root.children.forEach(collapse);
        update(root);

        function update(source) {
            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) { d.y = d.depth * 180; });

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                .on("click", click);

            nodeEnter.append("foreignObject")
                .attr("width", 20)
                .attr("height", 20)
                .attr("x", -25)
                .attr("y",-10)
                .append("xhtml:body")
                .html(function(d) {
                    return getCheckboxAttributes(d);
                })
                .on("click", function(d, i){
                    var includeThis = svg.select("#"+ d.id).node().checked;
                    d.include = includeThis;
                });

            function getCheckboxAttributes(d) {
                var htmlCode = "";
                if (d.include == true) //checked
                    if (d.minimalInfo == true)
                        htmlCode = "<form><input type=checkbox id="+ d.id+ " checked disabled></form>";// do not allow to uncheck
                    else
                        htmlCode = "<form><input type=checkbox id="+ d.id+ " checked></form>";// allow to uncheck
                else // not initially selected
                {
                    htmlCode = "<form><input type=checkbox id="+ d.id+ "></form>";// allow to uncheck
                }

                return htmlCode;
            }

            nodeEnter.append("text")
                .attr("x", 10)
                .attr("dy", ".35em")
                .attr("text-anchor", 'start')
                .text(function(d) { return d.name; })
                .style("fill-opacity", 1e-6)
                .style("font-size", "14px")
                .style("font-weight", function(d) { return d.children || d._children ? "bold" : ""; });

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });


            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                .remove();

            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }

    return {
        restrict:"E",
        link: function ($scope, element){
            display($scope, element);
        }
    };
});

configModule.controller('configCtrl', function ($scope, viewService) {
    $scope.configData = viewService.getConfiguration();
})
