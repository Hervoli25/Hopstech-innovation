import { Code2, Database, Cloud, Cog, Terminal, Layout, Shield, TrendingUp, Zap, GitBranch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const SkillsSection = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Code2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      skills: {
        'Backend': ['Python (Flask, Django)', 'SQL'],
        'Frontend': ['JavaScript', 'HTML5', 'CSS3', 'TypeScript'],
      },
    },
    {
      title: 'Frameworks & Libraries',
      icon: Layout,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      skills: {
        'Frontend': ['React', 'Next.js', 'Tailwind CSS', 'Bootstrap'],
        'Backend': ['Flask', 'Django'],
        'Full-Stack': ['Node.js'],
      },
    },
    {
      title: 'Databases',
      icon: Database,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      skills: {
        'SQL': ['PostgreSQL', 'MySQL', 'Neon DB'],
        'NoSQL': ['MongoDB', 'Redis'],
        'ORM': ['Prisma ORM', 'Drizzle ORM'],
      },
    },
    {
      title: 'DevOps & Infrastructure',
      icon: Cloud,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      skills: {
        'Containerization': ['Docker', 'Docker Compose'],
        'CI/CD': ['GitHub Actions', 'GitLab CI'],
        'Monitoring': ['Prometheus', 'Grafana', 'ELK Stack'],
        'Web Servers': ['Nginx', 'Apache'],
        'Cloud': ['Linux (Ubuntu, Debian)', 'Bash scripting', 'Terraform'],
      },
    },
    {
      title: 'Development Tools',
      icon: Terminal,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      skills: {
        'Version Control': ['Git', 'GitHub', 'GitLab'],
        'IDEs': ['VS Code', 'PyCharm'],
        'API': ['RESTful API', 'API Testing', 'Postman'],
      },
    },
    {
      title: 'Architecture & Design',
      icon: Cog,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      skills: {
        'Patterns': ['Microservices', 'Cloud Native', 'High Availability', 'Design Patterns'],
        'Methodologies': ['Agile', 'Code Review', 'Technical Documentation'],
      },
    },
    {
      title: 'Security',
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      skills: {
        'Authentication': ['OAuth', 'JWT'],
        'Protocols': ['HTTPS/SSL'],
        'Best Practices': ['Application Security', 'Secure Coding'],
      },
    },
    {
      title: 'Performance & Testing',
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      skills: {
        'Optimization': ['SQL Query Optimization', 'Caching Strategies', 'Load Balancing'],
        'Testing': ['Unit Testing', 'Integration Testing', 'Test Automation'],
      },
    },
    {
      title: 'Integrations & APIs',
      icon: Zap,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      skills: {
        'Third-Party': ['Google Translate API', 'Zoho Mail API'],
        'Development': ['RESTful APIs', 'Webhooks', 'API Documentation'],
      },
    },
    {
      title: 'Additional Skills',
      icon: GitBranch,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20',
      skills: {
        'Design': ['Responsive Design', 'UI/UX Design'],
        'Optimization': ['SEO Optimization', 'Performance Tuning'],
      },
    },
  ];

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Technical Expertise
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive toolkit of modern technologies and best practices for building scalable, high-performance solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <Card
                key={idx}
                className={`bg-slate-800/50 border-slate-700 hover:${category.borderColor} transition-all duration-300 hover:shadow-lg hover:shadow-${category.color}/20`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <CardTitle className="text-white text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(category.skills).map(([subcategory, items]) => (
                    <div key={subcategory}>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">{subcategory}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill: string, skillIdx: number) => (
                          <Badge
                            key={skillIdx}
                            variant="secondary"
                            className={`${category.bgColor} ${category.color} ${category.borderColor} text-xs`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-center">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-blue-100 text-sm">Programming Languages</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-center">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-purple-100 text-sm">Frameworks & Tools</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0 text-center">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-white mb-2">8+</div>
              <div className="text-green-100 text-sm">Database Technologies</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0 text-center">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-white mb-2">20+</div>
              <div className="text-orange-100 text-sm">DevOps & Cloud Tools</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
