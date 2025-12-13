import { useState } from 'react';
import { Link } from 'wouter';
import { Code2, Search } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { trpc } from '../lib/trpc';

const PortfolioPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: projects, isLoading } = trpc.projects.getAll.useQuery({
    search: searchQuery || undefined,
    category: selectedCategory,
  });

  const categories = ['All', 'DevOps', 'Full-Stack Development', 'Cloud Architecture'];

  const filteredProjects = projects || [];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              My Portfolio
            </h1>
            <p className="text-xl text-gray-300">
              Explore my recent projects showcasing DevOps engineering, full-stack development, and cloud architecture expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-slate-900/50 sticky top-16 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === (category === 'All' ? undefined : category) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category === 'All' ? undefined : category)}
                  className={
                    selectedCategory === (category === 'All' ? undefined : category)
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'border-slate-700 text-gray-300 hover:bg-slate-800'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center text-gray-400 py-20">Loading projects...</div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/portfolio/${project.slug}`}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer group h-full">
                    <div className="aspect-video bg-slate-700 relative overflow-hidden">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code2 className="h-16 w-16 text-slate-600" />
                        </div>
                      )}
                      {project.featured && (
                        <Badge className="absolute top-4 right-4 bg-blue-600">Featured</Badge>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors mb-2">
                            {project.title}
                          </CardTitle>
                          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-2">
                            {project.category}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-gray-400">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies && project.technologies.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs border-slate-600 text-gray-400">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies && project.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-gray-400">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Code2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">No projects found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default PortfolioPage;
