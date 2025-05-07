
import React, { useState, useEffect } from 'react';
import {
  getAllSurveyResponses,
  clearAllSurveyData,
} from '@/lib/localStorage';
import { SurveyResponse } from '@/types/survey';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResponseStats from "@/components/admin/ResponseStats";
import FilterControls from "@/components/admin/FilterControls";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { getAllSurveyResponsesFromDB, countSurveyResponses } from '@/lib/surveyService';

const ADMIN_PIN = "223344";

const AdminPage = () => {
  const isMobile = useIsMobile();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showResponses, setShowResponses] = useState(false);
  const [activeResponseTab, setActiveResponseTab] = useState("demographics");
  const [isLoading, setIsLoading] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  
  const [filters, setFilters] = useState({
    ageGroup: null as string | null,
    educationLevel: null as string | null,
    professionalSector: null as string | null
  });

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setIsLoading(true);
        // Get responses directly from Supabase
        const storedResponses = await getAllSurveyResponsesFromDB();
        
        // Get the total count
        const total = await countSurveyResponses();
        setResponseCount(total);
        
        if (storedResponses.length > 0) {
          setResponses(storedResponses);
          setFilteredResponses(storedResponses);
        } else {
          setResponses([]);
          setFilteredResponses([]);
          toast.info("No survey responses found in database.");
        }
      } catch (error) {
        console.error("Error fetching survey responses:", error);
        toast.error("Error loading survey responses from database.");
        setResponses([]);
        setFilteredResponses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (authenticated) {
      fetchResponses();
    }
  }, [authenticated]);

  useEffect(() => {
    applyFilters();
  }, [filters, responses]);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Code PIN incorrect, veuillez réessayer.");
    }
  }

  const applyFilters = () => {
    let result = [...responses];
    
    if (filters.ageGroup) {
      result = result.filter(r => r.demographics?.ageGroup === filters.ageGroup);
    }
    
    if (filters.educationLevel) {
      result = result.filter(r => r.demographics?.educationLevel === filters.educationLevel);
    }
    
    if (filters.professionalSector) {
      result = result.filter(r => r.demographics?.professionalSector === filters.professionalSector);
    }
    
    setFilteredResponses(result);
  };

  const handleFilterChange = (filter: string, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      ageGroup: null,
      educationLevel: null,
      professionalSector: null
    });
  };

  const handleClearResponses = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les réponses du sondage ? Cette action est irréversible.")) {
      await clearAllSurveyData();
      setResponses([]);
      setFilteredResponses([]);
      alert("Toutes les réponses du sondage ont été supprimées.");
    }
  };

  const handleRefreshData = async () => {
    try {
      setIsLoading(true);
      const storedResponses = await getAllSurveyResponsesFromDB();
      const total = await countSurveyResponses();
      setResponseCount(total);
      
      setResponses(storedResponses);
      setFilteredResponses(storedResponses);
      toast.success("Données rafraîchies avec succès.");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Erreur lors du rafraîchissement des données.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = (format: 'json' | 'csv') => {
    if (responses.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    let dataStr = '';
    let filename = '';

    if (format === 'json') {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
      filename = "survey_responses.json";
    } else if (format === 'csv') {
      // Simple CSV export
      const headers = ["id", "submittedAt", "ageGroup", "educationLevel", "professionalSector", "usesSocialMedia"];
      const csvData = responses.map(r => [
        r.id,
        r.submittedAt,
        r.demographics?.ageGroup || '',
        r.demographics?.educationLevel || '',
        r.demographics?.professionalSector || '',
        r.socialMedia?.usesSocialMedia ? 'Oui' : 'Non',
      ]);
      
      dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent([headers.join(','), ...csvData.map(row => row.join(','))].join('\n'));
      filename = "survey_responses.csv";
    }

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header isAdmin={true} />
        <main className="flex-grow container mx-auto p-4 sm:p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentification Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">Code PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Entrez le code PIN à 6 chiffres"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLogin();
                      }
                    }}
                  />
                  {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Se connecter
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header isAdmin={true} />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Page d'administration du sondage</h1>
          <Button 
            variant="outline" 
            onClick={handleRefreshData} 
            className="mt-2 sm:mt-0"
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Rafraîchir les données"}
          </Button>
        </div>
        
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <Label className="block mb-2 sm:mb-0 sm:inline-block sm:mr-4">Nombre total de réponses: {responseCount}</Label>
            <Label>Réponses filtrées: {filteredResponses.length}</Label>
          </div>
          
          <Button 
            variant="outline"
            className="mt-2 sm:mt-0" 
            onClick={() => setShowResponses(!showResponses)}
          >
            {showResponses ? "Masquer les réponses" : "Afficher les réponses"}
          </Button>
        </div>

        <div className="mb-6">
          <FilterControls 
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onResetData={handleClearResponses}
            onExportData={handleExportData}
            filters={filters}
            responseCount={responses.length}
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Chargement des données...</div>
        ) : (
          <>
            {filteredResponses.length > 0 && (
              <div className={isMobile ? "mb-6" : ""}>
                <ResponseStats responses={filteredResponses} />
              </div>
            )}
            
            {showResponses && (
              <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Réponses au sondage</h2>
                {filteredResponses.length === 0 ? (
                  <p>Aucune réponse au sondage n'a été trouvée.</p>
                ) : (
                  <ScrollArea className={isMobile ? "h-[400px]" : "h-auto"}>
                    <ul className="space-y-4">
                      {filteredResponses.map((response, index) => (
                        <li key={response.id || index} className="border p-4 rounded">
                          <h3 className="font-bold mb-2">Réponse #{index + 1}</h3>
                          
                          <Tabs defaultValue="demographics" className="w-full">
                            <TabsList className="w-full mb-2 grid grid-cols-2 md:grid-cols-4">
                              <TabsTrigger value="demographics">Démographiques</TabsTrigger>
                              <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
                              <TabsTrigger value="influencer">Influenceurs</TabsTrigger>
                              <TabsTrigger value="purchase">Achat & Opinion</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="demographics" className="space-y-2 bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                              <div>
                                <p className="font-semibold">Date:</p> 
                                <p>{new Date(response.submittedAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Groupe d'âge:</p>
                                <p>{response.demographics.ageGroup}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Niveau d'éducation:</p>
                                <p>{response.demographics.educationLevel}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Secteur professionnel:</p>
                                <p>{response.demographics.professionalSector}</p>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="social" className="space-y-2 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                              <div>
                                <p className="font-semibold">Utilise les réseaux sociaux:</p>
                                <p>{response.socialMedia?.usesSocialMedia ? 'Oui' : 'Non'}</p>
                              </div>
                              {response.socialMedia?.usesSocialMedia && (
                                <>
                                  <div>
                                    <p className="font-semibold">Plateformes:</p>
                                    <p>{response.socialMedia.platforms.join(', ') || 'Non spécifié'}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Utilisation:</p>
                                    <p>{response.socialMedia.purpose.join(', ') || 'Non spécifié'}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Usage fréquent:</p>
                                    <p>{response.socialMedia.frequentUsage || 'Non spécifié'}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Entreprises connues:</p>
                                    <p>{response.socialMedia.knownCompanies?.join(', ') || 'Aucune'}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Opinion sur les influenceurs:</p>
                                    <p>{response.socialMedia.influencerOpinion}</p>
                                  </div>
                                </>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="influencer" className="space-y-2 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                              {response.socialMedia?.usesSocialMedia ? (
                                <>
                                  <div>
                                    <p className="font-semibold">Suit des influenceurs:</p>
                                    <p>{response.influencerRelations?.followsInfluencers ? 'Oui' : 'Non'}</p>
                                  </div>
                                  
                                  {response.influencerRelations?.followsInfluencers && (
                                    <>
                                      <div>
                                        <p className="font-semibold">Raisons de suivre:</p>
                                        <p>
                                          {response.influencerRelations.followReasons?.map(reason => {
                                            const labels: {[key: string]: string} = {
                                              'fashion-beauty': 'Mode/Beauté', 
                                              'travel-discovery': 'Voyages/Découvertes', 
                                              'product-advice': 'Conseils produits', 
                                              'humor-entertainment': 'Humour/Divertissement', 
                                              'other': 'Autre'
                                            };
                                            return labels[reason] || reason;
                                          }).join(', ') || 'Non spécifié'}
                                        </p>
                                      </div>
                                      
                                      {response.influencerRelations.otherFollowReason && (
                                        <div>
                                          <p className="font-semibold">Autre raison:</p>
                                          <p>{response.influencerRelations.otherFollowReason}</p>
                                        </div>
                                      )}
                                      
                                      <div>
                                        <p className="font-semibold">Niveau de confiance:</p>
                                        <p>
                                          {(() => {
                                            const labels: {[key: string]: string} = {
                                              'not-at-all': 'Pas du tout', 
                                              'little': 'Peu', 
                                              'medium': 'Moyennement', 
                                              'lot': 'Beaucoup', 
                                              'completely': 'Complètement'
                                            };
                                            return labels[response.influencerRelations.trustLevel] || response.influencerRelations.trustLevel;
                                          })()}
                                        </p>
                                      </div>
                                      
                                      <div>
                                        <p className="font-semibold">A liké/commenté une publication sponsorisée:</p>
                                        <p>{response.engagement?.hasLikedSponsoredPost ? 'Oui' : 'Non'}</p>
                                      </div>
                                      
                                      <div>
                                        <p className="font-semibold">Réaction face à une publication sponsorisée:</p>
                                        <p>
                                          {(() => {
                                            const labels: {[key: string]: string} = {
                                              'ignore': 'Ignore', 
                                              'read-no-reaction': 'Lit sans réagir', 
                                              'interested-more-info': 'Cherche plus d\'infos', 
                                              'click-link-product': 'Clique sur le lien/produit'
                                            };
                                            return labels[response.engagement?.sponsoredPostReaction || ''] || 'Non spécifié';
                                          })()}
                                        </p>
                                      </div>
                                      
                                      <div>
                                        <p className="font-semibold">A recherché un produit recommandé:</p>
                                        <p>{response.engagement?.hasResearchedProduct ? 'Oui' : 'Non'}</p>
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : (
                                <p>N'utilise pas les réseaux sociaux</p>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="purchase" className="space-y-2 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                              {response.socialMedia?.usesSocialMedia && response.influencerRelations?.followsInfluencers ? (
                                <>
                                  <div>
                                    <p className="font-semibold">Achat suite à une recommandation:</p>
                                    <p>
                                      {response.engagement?.hasPurchasedProduct === true ? 'Oui' : 
                                       response.engagement?.hasPurchasedProduct === false ? 'Non' : 
                                       'Ne sait plus'}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-semibold">Influence sur l'intention d'achat:</p>
                                    <p>
                                      {(() => {
                                        const labels: {[key: string]: string} = {
                                          'not-at-all': 'Pas du tout', 
                                          'little': 'Un peu', 
                                          'medium': 'Moyennement', 
                                          'lot': 'Beaucoup', 
                                          'enormously': 'Énormément'
                                        };
                                        return labels[response.purchaseIntention?.influenceLevel || ''] || 'Non spécifié';
                                      })()}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-semibold">Types d'influenceurs préférés:</p>
                                    <p>
                                      {(() => {
                                        const labels: {[key: string]: string} = {
                                          'micro': 'Micro-influenceurs', 
                                          'macro': 'Macro-influenceurs', 
                                          'doesnt-matter': 'Peu importe'
                                        };
                                        return labels[response.purchaseIntention?.preferredInfluencerType || ''] || 'Non spécifié';
                                      })()}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-semibold">Fidèle à un ou plusieurs influenceurs:</p>
                                    <p>{response.purchaseIntention?.isLoyalToInfluencers ? 'Oui' : 'Non'}</p>
                                  </div>
                                  
                                  {response.purchaseIntention?.isLoyalToInfluencers && response.purchaseIntention.loyaltyReason && (
                                    <div>
                                      <p className="font-semibold">Raison de la fidélité:</p>
                                      <p>{response.purchaseIntention.loyaltyReason}</p>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <p className="font-semibold">Efficacité du marketing d'influence:</p>
                                    <p>
                                      {(() => {
                                        const labels: {[key: string]: string} = {
                                          'not-at-all': 'Pas du tout', 
                                          'not-very': 'Peu efficace', 
                                          'moderately': 'Moyennement efficace', 
                                          'very': 'Très efficace'
                                        };
                                        return labels[response.globalAppreciation?.marketingEfficiency || ''] || 'Non spécifié';
                                      })()}
                                    </p>
                                  </div>
                                  
                                  {response.globalAppreciation?.additionalRemarks && (
                                    <div>
                                      <p className="font-semibold">Remarques additionnelles:</p>
                                      <p>{response.globalAppreciation.additionalRemarks}</p>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <p>N'utilise pas les réseaux sociaux ou ne suit pas d'influenceurs</p>
                              )}
                            </TabsContent>
                          </Tabs>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
