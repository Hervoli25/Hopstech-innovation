import { useParams, Link } from 'wouter';
import { ArrowLeft, ExternalLink, Github, Calendar, User, TrendingUp, Expand } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '../components/ui/carousel';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { trpc } from '../lib/trpc';
import { useState, useEffect } from 'react';
import ResponsiveShowcaseImage from '../components/ResponsiveShowcaseImage';

const ProjectDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Sync carousel with thumbnail clicks
  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.scrollTo(selectedImageIndex);
  }, [selectedImageIndex, carouselApi]);

  // Update selected index when carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setSelectedImageIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="text-gray-400">Loading project...</div>
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8">The project you're looking for doesn't exist.</p>
          <Link href="/portfolio">
            <Button variant="outline" className="border-blue-400 text-blue-400">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20 pt-28 pb-12 sm:pt-32 sm:pb-16">
        <div className="container mx-auto px-4">
          <Link href="/portfolio">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Button>
          </Link>

          <div className="max-w-4xl">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
              {project.category}
            </Badge>
            <h1 className="mb-5 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              {project.title}
            </h1>
            <p className="mb-8 text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
              {project.description}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-slate-700 text-gray-300 hover:bg-slate-800 sm:w-auto">
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Images Gallery */}
              {project.images && project.images.length > 0 ? (
                <div className="space-y-4">
                  <Carousel
                    className="w-full"
                    opts={{ startIndex: selectedImageIndex }}
                    setApi={setCarouselApi}
                    autoplay={true}
                    autoplayDelay={5000}
                  >
                    <CarouselContent>
                      {project.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-[4/5] sm:aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
                            {/* Loading skeleton */}
                            <div className="absolute inset-0 bg-slate-800 animate-pulse" />

                            {/* Image with proper containment */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedImageIndex(index);
                                setIsLightboxOpen(true);
                              }}
                              className="relative flex h-full w-full items-center justify-center p-1 sm:p-4"
                              aria-label={`Expand ${project.title} image ${index + 1}`}
                            >
                              <ResponsiveShowcaseImage
                                src={image}
                                alt={`${project.title} - View ${index + 1}`}
                                className="h-full w-full object-contain rounded-lg shadow-lg transition-opacity duration-300"
                                loading="lazy"
                                sizes="(max-width: 640px) 96vw, (max-width: 1280px) 66vw, 960px"
                                onLoad={(e) => {
                                  e.currentTarget.parentElement?.previousElementSibling?.classList.add('hidden');
                                }}
                              />
                            </button>

                            <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-medium shadow-lg">
                              Tap to expand
                            </div>

                            {/* Image counter overlay */}
                            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                              {index + 1} / {project.images.length}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-3 sm:left-4 bg-black/60 hover:bg-black/80 text-white border-white/20" />
                    <CarouselNext className="right-3 sm:right-4 bg-black/60 hover:bg-black/80 text-white border-white/20" />
                  </Carousel>

                  {/* Thumbnail Navigation */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {project.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-md overflow-hidden cursor-pointer transition-all duration-200 border ${
                          selectedImageIndex === index
                            ? 'ring-2 ring-blue-500 scale-105 border-blue-500'
                            : 'border-slate-700/50 hover:ring-2 hover:ring-blue-400/50 hover:scale-105 hover:border-blue-400/50'
                        }`}
                      >
                        <div className="w-full h-full p-2 flex items-center justify-center">
                          <ResponsiveShowcaseImage
                            src={image}
                            alt={`${project.title} - View ${index + 1}`}
                            className="max-w-full max-h-full object-contain"
                            loading="lazy"
                            sizes="(max-width: 640px) 30vw, 140px"
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                    <DialogContent
                      className="max-w-[96vw] border-slate-800 bg-slate-950 p-3 sm:p-5 text-white"
                      showCloseButton={true}
                    >
                      <div className="flex items-center justify-between gap-3 px-1 pb-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{project.title}</p>
                          <p className="text-xs text-slate-400">
                            Image {selectedImageIndex + 1} of {project.images.length}
                          </p>
                        </div>
                        <Expand className="h-4 w-4 text-slate-400" />
                      </div>

                      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden rounded-xl bg-black">
                        <img
                          src={project.images[selectedImageIndex]}
                          alt={`${project.title} - Expanded view ${selectedImageIndex + 1}`}
                          className="max-h-[78vh] w-full object-contain"
                        />

                        {project.images.length > 1 ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="absolute left-3 top-1/2 -translate-y-1/2 border-white/15 bg-black/55 text-white hover:bg-black/75"
                              onClick={() =>
                                setSelectedImageIndex((current) =>
                                  current === 0 ? project.images.length - 1 : current - 1
                                )
                              }
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="absolute right-3 top-1/2 -translate-y-1/2 border-white/15 bg-black/55 text-white hover:bg-black/75"
                              onClick={() =>
                                setSelectedImageIndex((current) =>
                                  current === project.images.length - 1 ? 0 : current + 1
                                )
                              }
                            >
                              <ArrowLeft className="h-4 w-4 rotate-180" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : project.thumbnail ? (
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden">
                  <ResponsiveShowcaseImage
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 640px) 96vw, 960px"
                  />
                </div>
              ) : null}

              {/* Description */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 whitespace-pre-line">
                      {project.longDescription}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics */}
              {project.metrics && Object.keys(project.metrics).length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
                      Key Metrics & Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="bg-slate-900/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400 mb-1">{value}</div>
                          <div className="text-sm text-gray-400">{key}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.client && (
                    <div>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <User className="mr-2 h-4 w-4" />
                        Client
                      </div>
                      <div className="text-white font-medium">{project.client}</div>
                    </div>
                  )}
                  {project.publishedAt && (
                    <div>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        Completed
                      </div>
                      <div className="text-white font-medium">
                        {new Date(project.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies && project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Interested in a Similar Project?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Let's discuss how I can help bring your vision to life with the same level of expertise and dedication.
              </p>
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start a Conversation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
};

export default ProjectDetailPage;
