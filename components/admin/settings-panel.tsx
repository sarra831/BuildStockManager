"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Mail, Phone, Bell, Shield, Database, FileText, Save } from "lucide-react"

export function SettingsPanel() {
  const [companySettings, setCompanySettings] = useState({
    name: "BuildStock Manager SARL",
    address: "123 Avenue des Matériaux, 75001 Paris, France",
    phone: "+33 1 23 45 67 89",
    email: "contact@buildstock.fr",
    website: "www.buildstock.fr",
    taxId: "FR12345678901",
    siret: "12345678901234",
    logo: "",
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    defaultTaxRate: 20,
    defaultPaymentTerms: 30,
    invoicePrefix: "FACT-",
    quotePrefix: "DEVIS-",
    footerText: "Merci pour votre confiance. Paiement à réception de facture.",
    bankDetails: "IBAN: FR76 1234 5678 9012 3456 789",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlerts: true,
    overdueInvoices: true,
    newOrders: true,
    systemUpdates: false,
    emailNotifications: true,
    smsNotifications: false,
  })

  const [systemSettings, setSystemSettings] = useState({
    language: "fr",
    timezone: "Europe/Paris",
    currency: "EUR",
    dateFormat: "DD/MM/YYYY",
    backupFrequency: "daily",
    sessionTimeout: 60,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    loginAttempts: 5,
    auditLogging: true,
    dataEncryption: true,
  })

  const handleSave = (section: string) => {
    // In a real app, this would save to backend
    console.log(`[v0] Saving ${section} settings`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Paramètres système</h2>
        <p className="text-muted-foreground">Configurez les paramètres globaux de BuildStock Manager</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="invoicing">Facturation</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de l'entreprise
              </CardTitle>
              <CardDescription>
                Configurez les informations de votre entreprise qui apparaîtront sur les documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète</Label>
                <Textarea
                  id="address"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Numéro de TVA</Label>
                  <Input
                    id="taxId"
                    value={companySettings.taxId}
                    onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={companySettings.siret}
                    onChange={(e) => setCompanySettings({ ...companySettings, siret: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("company")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les informations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoicing Settings */}
        <TabsContent value="invoicing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Paramètres de facturation
              </CardTitle>
              <CardDescription>Configurez les paramètres par défaut pour vos factures et devis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Taux de TVA par défaut (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    value={invoiceSettings.defaultTaxRate}
                    onChange={(e) =>
                      setInvoiceSettings({ ...invoiceSettings, defaultTaxRate: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Délai de paiement (jours)</Label>
                  <Input
                    id="paymentTerms"
                    type="number"
                    min="1"
                    value={invoiceSettings.defaultPaymentTerms}
                    onChange={(e) =>
                      setInvoiceSettings({ ...invoiceSettings, defaultPaymentTerms: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Préfixe factures</Label>
                  <Input
                    id="invoicePrefix"
                    value={invoiceSettings.invoicePrefix}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, invoicePrefix: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quotePrefix">Préfixe devis</Label>
                  <Input
                    id="quotePrefix"
                    value={invoiceSettings.quotePrefix}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, quotePrefix: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Texte de pied de page</Label>
                <Textarea
                  id="footerText"
                  value={invoiceSettings.footerText}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, footerText: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankDetails">Coordonnées bancaires</Label>
                <Textarea
                  id="bankDetails"
                  value={invoiceSettings.bankDetails}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, bankDetails: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={() => handleSave("invoicing")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Paramètres de notifications
              </CardTitle>
              <CardDescription>Configurez les alertes et notifications du système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes de stock faible</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des alertes quand le stock est bas</p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, lowStockAlerts: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Factures en retard</Label>
                    <p className="text-sm text-muted-foreground">Alertes pour les factures impayées</p>
                  </div>
                  <Switch
                    checked={notificationSettings.overdueInvoices}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, overdueInvoices: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nouvelles commandes</Label>
                    <p className="text-sm text-muted-foreground">Notifications pour les nouvelles commandes</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newOrders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, newOrders: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mises à jour système</Label>
                    <p className="text-sm text-muted-foreground">Notifications des mises à jour</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Canaux de notification</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Recevoir les notifications par email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">Recevoir les notifications par SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("notifications")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Paramètres système
              </CardTitle>
              <CardDescription>Configurez les paramètres généraux du système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={systemSettings.timezone}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={systemSettings.currency}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dollar ($)</SelectItem>
                      <SelectItem value="GBP">Livre (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Format de date</Label>
                  <Select
                    value={systemSettings.dateFormat}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, dateFormat: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                  <Select
                    value={systemSettings.backupFrequency}
                    onValueChange={(value) => setSystemSettings({ ...systemSettings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="15"
                    max="480"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, sessionTimeout: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("system")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder la configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
              <CardDescription>Configurez les paramètres de sécurité et d'audit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">Activer la 2FA pour tous les utilisateurs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                    {securitySettings.twoFactorAuth && <Badge variant="secondary">Activé</Badge>}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journalisation des audits</Label>
                    <p className="text-sm text-muted-foreground">Enregistrer toutes les actions utilisateur</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                    />
                    {securitySettings.auditLogging && <Badge variant="secondary">Activé</Badge>}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Chiffrement des données</Label>
                    <p className="text-sm text-muted-foreground">Chiffrer les données sensibles</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={securitySettings.dataEncryption}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, dataEncryption: checked })
                      }
                    />
                    {securitySettings.dataEncryption && <Badge variant="secondary">Activé</Badge>}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Expiration mot de passe (jours)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    min="30"
                    max="365"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, passwordExpiry: Number.parseInt(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Tentatives de connexion max</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={securitySettings.loginAttempts}
                    onChange={(e) =>
                      setSecuritySettings({ ...securitySettings, loginAttempts: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("security")} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder la sécurité
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
