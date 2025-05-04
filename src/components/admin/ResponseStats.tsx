
import React, { useState } from 'react';
import { SurveyResponse } from '@/types/survey';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResponseStatsProps {
  responses: SurveyResponse[];
}

// Chart colors
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#eab308', '#a855f7', '#ef4444'];

const ResponseStats: React.FC<ResponseStatsProps> = ({ responses }) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("demographics");
  
  // Count age group distribution
  const ageGroupCounts = responses.reduce((counts, response) => {
    const ageGroup = response.demographics?.ageGroup || '';
    counts[ageGroup] = (counts[ageGroup] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const ageGroupData = Object.entries(ageGroupCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Count education level distribution
  const educationCounts = responses.reduce((counts, response) => {
    const education = response.demographics?.educationLevel || 'Unknown';
    counts[education] = (counts[education] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const educationLabels: { [key: string]: string } = {
    'high-school': 'Lycée',
    'some-college': 'Formation supérieure',
    'bachelors': 'Licence',
    'masters': 'Master',
    'doctorate': 'Doctorat',
    'other': 'Autre'
  };

  const educationData = Object.entries(educationCounts).map(([key, value]) => ({
    name: educationLabels[key] || key,
    value,
  }));

  // Count professional sector distribution
  const sectorCounts = responses.reduce((counts, response) => {
    const sector = response.demographics?.professionalSector || 'Unknown';
    counts[sector] = (counts[sector] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const sectorLabels: { [key: string]: string } = {
    'technology': 'Technologie',
    'healthcare': 'Santé',
    'finance': 'Finance',
    'education': 'Éducation',
    'manufacturing': 'Industrie',
    'retail': 'Commerce',
    'government': 'Administration',
    'non-profit': 'Association',
    'other': 'Autre'
  };

  const sectorData = Object.entries(sectorCounts).map(([key, value]) => ({
    name: sectorLabels[key] || key,
    value,
  }));
  
  // Social Media Stats
  
  // Count users who use social media vs those who don't
  const socialMediaUsage = [
    { name: "Utilisateurs", value: responses.filter(r => r.socialMedia?.usesSocialMedia).length },
    { name: "Non-utilisateurs", value: responses.filter(r => r.socialMedia?.usesSocialMedia === false).length }
  ];
  
  // Platform usage
  const platformCounts: { [key: string]: number } = {};
  responses.forEach(response => {
    if (response.socialMedia?.platforms) {
      response.socialMedia.platforms.forEach(platform => {
        platformCounts[platform] = (platformCounts[platform] || 0) + 1;
      });
    }
  });

  const platformLabels: { [key: string]: string } = {
    'facebook': 'Facebook',
    'instagram': 'Instagram',
    'twitter': 'Twitter',
    'linkedin': 'LinkedIn',
    'tiktok': 'TikTok',
    'youtube': 'YouTube',
    'other': 'Autre'
  };
  
  const platformData = Object.entries(platformCounts).map(([key, value]) => ({
    name: platformLabels[key] || key,
    value,
  }));
  
  // Purpose counts
  const purposeCounts: { [key: string]: number } = {};
  responses.forEach(response => {
    if (response.socialMedia?.purpose) {
      response.socialMedia.purpose.forEach(purpose => {
        purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
      });
    }
  });

  const purposeLabels: { [key: string]: string } = {
    'personal': 'Personnel',
    'research': 'Recherche',
    'professional': 'Professionnel',
    'other': 'Autre'
  };
  
  const purposeData = Object.entries(purposeCounts).map(([key, value]) => ({
    name: purposeLabels[key] || key,
    value,
  }));
  
  // Influencer opinion counts
  const influencerCounts = responses.reduce((counts, response) => {
    const opinion = response.socialMedia?.influencerOpinion;
    if (opinion) {
      counts[opinion] = (counts[opinion] || 0) + 1;
    }
    return counts;
  }, {} as { [key: string]: number });

  const influencerLabels: { [key: string]: string } = {
    'yes': 'Oui',
    'probably': 'Probablement',
    'certainly-yes': 'Certainement',
    'no': 'Non'
  };
  
  const influencerData = Object.entries(influencerCounts).map(([key, value]) => ({
    name: influencerLabels[key] || key,
    value,
  }));
  
  // Company mentions - get the most mentioned companies
  const companyMentions: { [company: string]: number } = {};
  responses.forEach(response => {
    if (response.socialMedia?.knownCompanies) {
      response.socialMedia.knownCompanies.forEach(company => {
        const normalized = company.toLowerCase().trim();
        if (normalized) {
          companyMentions[normalized] = (companyMentions[normalized] || 0) + 1;
        }
      });
    }
  });
  
  // Get top 10 most mentioned companies
  const topCompanies = Object.entries(companyMentions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value: count }));

  // New Stats: Influencer Relations
  const followsInfluencersData = [
    { name: "Suit des influenceurs", value: responses.filter(r => r.influencerRelations?.followsInfluencers).length },
    { name: "Ne suit pas", value: responses.filter(r => r.socialMedia?.usesSocialMedia && r.influencerRelations?.followsInfluencers === false).length }
  ];

  // Reasons for following influencers
  const followReasonCounts: { [key: string]: number } = {};
  responses.forEach(response => {
    if (response.influencerRelations?.followReasons) {
      response.influencerRelations.followReasons.forEach(reason => {
        followReasonCounts[reason] = (followReasonCounts[reason] || 0) + 1;
      });
    }
  });

  const followReasonLabels: { [key: string]: string } = {
    'fashion-beauty': 'Mode/Beauté',
    'travel-discovery': 'Voyages/Découvertes',
    'product-advice': 'Conseils produits',
    'humor-entertainment': 'Humour/Divertissement',
    'other': 'Autre'
  };

  const followReasonData = Object.entries(followReasonCounts).map(([key, value]) => ({
    name: followReasonLabels[key] || key,
    value,
  }));

  // Trust levels
  const trustLevelCounts = responses.reduce((counts, response) => {
    const level = response.influencerRelations?.trustLevel;
    if (level) {
      counts[level] = (counts[level] || 0) + 1;
    }
    return counts;
  }, {} as { [key: string]: number });

  const trustLevelLabels: { [key: string]: string } = {
    'not-at-all': 'Pas du tout',
    'little': 'Peu',
    'medium': 'Moyennement',
    'lot': 'Beaucoup',
    'completely': 'Complètement'
  };

  const trustLevelData = Object.entries(trustLevelCounts).map(([key, value]) => ({
    name: trustLevelLabels[key] || key,
    value,
  }));

  // Engagement Stats
  const likedPostData = [
    { 
      name: "Ont liké/commenté", 
      value: responses.filter(r => r.engagement?.hasLikedSponsoredPost).length 
    },
    { 
      name: "N'ont pas liké", 
      value: responses.filter(r => r.influencerRelations?.followsInfluencers && r.engagement?.hasLikedSponsoredPost === false).length 
    }
  ];

  // Reactions to sponsored posts
  const reactionCounts = responses.reduce((counts, response) => {
    const reaction = response.engagement?.sponsoredPostReaction;
    if (reaction) {
      counts[reaction] = (counts[reaction] || 0) + 1;
    }
    return counts;
  }, {} as { [key: string]: number });

  const reactionLabels: { [key: string]: string } = {
    'ignore': 'Ignore',
    'read-no-reaction': 'Lit sans réagir',
    'interested-more-info': 'Cherche plus d\'infos',
    'click-link-product': 'Clique sur le lien/produit'
  };

  const reactionData = Object.entries(reactionCounts).map(([key, value]) => ({
    name: reactionLabels[key] || key,
    value,
  }));

  // Research and purchase behavior
  const researchedProductData = [
    { 
      name: "Ont recherché", 
      value: responses.filter(r => r.engagement?.hasResearchedProduct).length 
    },
    { 
      name: "N'ont pas recherché", 
      value: responses.filter(r => r.influencerRelations?.followsInfluencers && r.engagement?.hasResearchedProduct === false).length 
    }
  ];

  const purchasedProductData = [
    { name: "Oui", value: responses.filter(r => r.engagement?.hasPurchasedProduct === true).length },
    { name: "Non", value: responses.filter(r => r.influencerRelations?.followsInfluencers && r.engagement?.hasPurchasedProduct === false).length },
    { name: "Ne sait plus", value: responses.filter(r => r.engagement?.hasPurchasedProduct === null).length }
  ];

  // Purchase Intention Stats
  // Influence level
  const influenceLevelCounts = responses.reduce((counts, response) => {
    const level = response.purchaseIntention?.influenceLevel;
    if (level) {
      counts[level] = (counts[level] || 0) + 1;
    }
    return counts;
  }, {} as { [key: string]: number });

  const influenceLevelLabels: { [key: string]: string } = {
    'not-at-all': 'Pas du tout',
    'little': 'Un peu',
    'medium': 'Moyennement',
    'lot': 'Beaucoup',
    'enormously': 'Énormément'
  };

  const influenceLevelData = Object.entries(influenceLevelCounts).map(([key, value]) => ({
    name: influenceLevelLabels[key] || key,
    value,
  }));

  // Preferred influencer type
  const influencerTypeCounts = responses.reduce((counts, response) => {
    const type = response.purchaseIntention?.preferredInfluencerType;
    if (type) {
      counts[type] = (counts[type] || 0) + 1;
    }
    return counts;
  }, {} as { [key: string]: number });

  const influencerTypeLabels: { [key: string]: string } = {
    'micro': 'Micro-influenceurs',
    'macro': 'Macro-influenceurs',
    'doesnt-matter': 'Peu importe'
  };

  const influencerTypeData = Object.entries(influencerTypeCounts).map(([key, value]) => ({
    name: influencerTypeLabels[key] || key,
    value,
  }));

  // Loyalty to influencers
  const loyaltyData = [
    { name: "Fidèles", value: responses.filter(r => r.purchaseIntention?.isLoyalToInfluencers).length },
    { 
      name: "Non fidèles", 
      value: responses.filter(r => r.influencerRelations?.followsInfluencers && r.purchaseIntention?.isLoyalToInfluencers === false).length 
    }
  ];

  // Global Appreciation Stats
  // Marketing efficiency
  const marketingEfficiencyCounts = responses.reduce((counts, response) => {
    const efficiency = response.globalAppreciation?.marketingEfficiency;
    if (efficiency) {
      counts[efficiency] = (counts[efficiency] || 0) + 1;
    }
    return counts;
  }, {} as { [key: string]: number });

  const marketingEfficiencyLabels: { [key: string]: string } = {
    'not-at-all': 'Pas du tout',
    'not-very': 'Peu efficace',
    'moderately': 'Moyennement efficace',
    'very': 'Très efficace'
  };

  const marketingEfficiencyData = Object.entries(marketingEfficiencyCounts).map(([key, value]) => ({
    name: marketingEfficiencyLabels[key] || key,
    value,
  }));

  const chartHeight = isMobile ? 250 : 300;
  const chartWidth = '100%';

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-4">Statistiques des Réponses</h2>

      <Tabs defaultValue="demographics" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="demographics" className="flex-1">
            Démographiques
          </TabsTrigger>
          <TabsTrigger value="social" className="flex-1">
            Réseaux Sociaux
          </TabsTrigger>
          <TabsTrigger value="relations" className="flex-1">
            Relations Influenceurs
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex-1">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="purchase" className="flex-1">
            Achat & Opinion
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="demographics" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Groups Chart */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Groupes d'âge</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <PieChart width={chartWidth} height={chartHeight}>
                    <Pie
                      data={ageGroupData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ageGroupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>

            {/* Education Chart */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Niveau d'éducation</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={educationData}
                    layout={isMobile ? "vertical" : "horizontal"}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isMobile ? (
                      <>
                        <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10}} />
                        <XAxis type="number" />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis />
                      </>
                    )}
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Sector Chart */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Secteurs professionnels</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={sectorData}
                    layout={isMobile ? "vertical" : "horizontal"}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isMobile ? (
                      <>
                        <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10}} />
                        <XAxis type="number" />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="name" />
                        <YAxis />
                      </>
                    )}
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Social Media Usage */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Utilisation des Réseaux Sociaux</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <PieChart width={chartWidth} height={chartHeight}>
                    <Pie
                      data={socialMediaUsage}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {socialMediaUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>

            {/* Platform Usage */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Plateformes Utilisées</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={platformData}
                    layout={isMobile ? "vertical" : "horizontal"}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isMobile ? (
                      <>
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10}} />
                        <XAxis type="number" />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis />
                      </>
                    )}
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#ec4899" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
            
            {/* Purpose */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Objectif d'Utilisation</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <PieChart width={chartWidth} height={chartHeight}>
                    <Pie
                      data={purposeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {purposeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            
            {/* Influencer Opinion */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Opinion sur les Influenceurs</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={influencerData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#f97316" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
            
            {/* Top Companies */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Entreprises les plus mentionnées</h3>
              {topCompanies.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entreprise</TableHead>
                        <TableHead className="text-right">Mentions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCompanies.map((company, index) => (
                        <TableRow key={index}>
                          <TableCell>{company.name}</TableCell>
                          <TableCell className="text-right">{company.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune entreprise mentionnée</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="relations" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Follows Influencers */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Suit des influenceurs</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <PieChart width={chartWidth} height={chartHeight}>
                    <Pie
                      data={followsInfluencersData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {followsInfluencersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>

            {/* Follow Reasons */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Raisons de suivre des influenceurs</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={followReasonData}
                    layout={isMobile ? "vertical" : "horizontal"}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isMobile ? (
                      <>
                        <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10}} />
                        <XAxis type="number" />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis />
                      </>
                    )}
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#22c55e" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Trust Levels */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Niveau de confiance envers les influenceurs</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={trustLevelData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#a855f7" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liked/Commented Posts */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Ont liké/commenté des publications</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <PieChart width={chartWidth} height={chartHeight}>
                    <Pie
                      data={likedPostData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {likedPostData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>

            {/* Reactions to Sponsored Posts */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Réactions aux publications sponsorisées</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={reactionData}
                    layout={isMobile ? "vertical" : "horizontal"}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isMobile ? (
                      <>
                        <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10}} />
                        <XAxis type="number" />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis />
                      </>
                    )}
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#eab308" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
            
            {/* Researched Products */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Recherche de produits recommandés</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <PieChart width={chartWidth} height={chartHeight}>
                    <Pie
                      data={researchedProductData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {researchedProductData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            
            {/* Purchased Products */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Achats suite à des recommandations</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={purchasedProductData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#ef4444" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="purchase" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Influence on Purchase Intention */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Influence sur l'intention d'achat</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={influenceLevelData}
                    layout={isMobile ? "vertical" : "horizontal"}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isMobile ? (
                      <>
                        <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 10}} />
                        <XAxis type="number" />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="name" />
                        <YAxis />
                      </>
                    )}
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Preferred Influencer Types */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Types d'influenceurs préférés</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <PieChart width={chartWidth} height={chartHeight}>
                    <Pie
                      data={influencerTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {influencerTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            
            {/* Loyalty to Influencers */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Fidélité aux influenceurs</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <PieChart width={chartWidth} height={chartHeight}>
                    <Pie
                      data={loyaltyData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {loyaltyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            
            {/* Marketing Efficiency */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">Efficacité du marketing d'influence</h3>
              <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="h-full">
                  <BarChart 
                    width={chartWidth} 
                    height={chartHeight} 
                    data={marketingEfficiencyData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponseStats;
