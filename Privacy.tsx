import Layout from '../components/Layout'
import { Shield } from 'lucide-react'

export default function Privacy() {
  return (
    <Layout>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'calc(var(--spacing) * 6) calc(var(--spacing) * 4)'
      }}>
        <div style={{
          marginBottom: 'calc(var(--spacing) * 6)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 211, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto calc(var(--spacing) * 3)'
          }}>
            <Shield size={40} color="var(--yellow)" />
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 2)'
          }}>
            Politique de Confidentialité
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)'
          }}>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: 'calc(var(--spacing) * 6)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          lineHeight: '1.8'
        }}>
          <Section title="1. Introduction">
            <p>StarStage s'engage à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).</p>
          </Section>

          <Section title="2. Responsable du traitement">
            <p><strong>JLBELE CONSULTING</strong><br />
            SIREN : 888 702 834<br />
            Email : privacy@starstage.com<br />
            Délégué à la protection des données : dpo@starstage.com</p>
          </Section>

          <Section title="3. Données collectées">
            <p><strong>Lors de l'inscription :</strong></p>
            <ul>
              <li>Adresse email (obligatoire)</li>
              <li>Nom d'utilisateur (obligatoire)</li>
              <li>Mot de passe (crypté)</li>
            </ul>
            <p><strong>Lors de l'utilisation :</strong></p>
            <ul>
              <li>Données de navigation (pages visitées, durée)</li>
              <li>Adresse IP</li>
              <li>Type de navigateur et appareil</li>
              <li>Interactions avec les streams (vues, likes, commentaires)</li>
            </ul>
            <p><strong>Données optionnelles :</strong></p>
            <ul>
              <li>Photo de profil</li>
              <li>Biographie</li>
              <li>Préférences de notification</li>
            </ul>
            <p><strong>Données de paiement :</strong></p>
            <ul>
              <li>Traitées par notre prestataire Stripe</li>
              <li>Nous ne stockons jamais vos coordonnées bancaires</li>
            </ul>
          </Section>

          <Section title="4. Finalités du traitement">
            <p>Nous utilisons vos données pour :</p>
            <ul>
              <li>Créer et gérer votre compte</li>
              <li>Fournir nos services de streaming</li>
              <li>Traiter vos paiements</li>
              <li>Vous envoyer des notifications importantes</li>
              <li>Améliorer nos services</li>
              <li>Prévenir la fraude et les abus</li>
              <li>Respecter nos obligations légales</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
            </ul>
          </Section>

          <Section title="5. Base légale">
            <ul>
              <li><strong>Exécution du contrat :</strong> Traitement nécessaire pour fournir nos services</li>
              <li><strong>Obligation légale :</strong> Conservation des données de paiement, lutte contre la fraude</li>
              <li><strong>Intérêt légitime :</strong> Amélioration de nos services, sécurité</li>
              <li><strong>Consentement :</strong> Communications marketing, cookies non essentiels</li>
            </ul>
          </Section>

          <Section title="6. Partage des données">
            <p>Nous ne vendons jamais vos données personnelles. Nous partageons vos données uniquement avec :</p>
            <ul>
              <li><strong>Stripe :</strong> Traitement des paiements</li>
              <li><strong>Supabase :</strong> Hébergement de la base de données (UE)</li>
              <li><strong>Services d'analyse :</strong> Uniquement données anonymisées</li>
              <li><strong>Autorités :</strong> Si requis par la loi</li>
            </ul>
          </Section>

          <Section title="7. Transferts internationaux">
            <p>Vos données sont stockées dans l'Union Européenne. Si un transfert hors UE est nécessaire, nous utilisons les clauses contractuelles types de la Commission Européenne.</p>
          </Section>

          <Section title="8. Durée de conservation">
            <ul>
              <li><strong>Données de compte :</strong> Jusqu'à suppression du compte + 30 jours</li>
              <li><strong>Données de paiement :</strong> 10 ans (obligation légale)</li>
              <li><strong>Logs de connexion :</strong> 12 mois</li>
              <li><strong>Données marketing :</strong> 3 ans sans interaction</li>
            </ul>
          </Section>

          <Section title="9. Vos droits (RGPD)">
            <p>Vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> Supprimer vos données</li>
              <li><strong>Droit à la limitation :</strong> Limiter le traitement</li>
              <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> S'opposer au traitement</li>
              <li><strong>Droit de retrait du consentement :</strong> À tout moment</li>
            </ul>
            <p>Pour exercer vos droits : privacy@starstage.com</p>
            <p>Vous pouvez également saisir la CNIL : www.cnil.fr</p>
          </Section>

          <Section title="10. Cookies">
            <p><strong>Cookies essentiels :</strong></p>
            <ul>
              <li>Authentification</li>
              <li>Sécurité</li>
              <li>Préférences de session</li>
            </ul>
            <p><strong>Cookies analytiques (avec consentement) :</strong></p>
            <ul>
              <li>Mesure d'audience</li>
              <li>Amélioration des performances</li>
            </ul>
            <p>Vous pouvez gérer vos préférences de cookies dans les paramètres.</p>
          </Section>

          <Section title="11. Sécurité">
            <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles :</p>
            <ul>
              <li>Chiffrement des données sensibles (SSL/TLS)</li>
              <li>Mots de passe cryptés (bcrypt)</li>
              <li>Accès restreint aux données</li>
              <li>Audits de sécurité réguliers</li>
              <li>Surveillance des intrusions</li>
            </ul>
          </Section>

          <Section title="12. Protection des mineurs">
            <p>Notre service est réservé aux personnes de 18 ans et plus. Nous ne collectons pas sciemment de données d'enfants de moins de 18 ans.</p>
          </Section>

          <Section title="13. Modifications">
            <p>Nous pouvons modifier cette politique. Les changements importants vous seront notifiés par email 30 jours avant leur entrée en vigueur.</p>
          </Section>

          <Section title="14. Contact">
            <p>Pour toute question sur vos données personnelles :<br />
            Email : privacy@starstage.com<br />
            DPO : dpo@starstage.com<br />
            Entreprise : JLBELE CONSULTING (SIREN : 888 702 834)</p>
          </Section>
        </div>
      </div>
    </Layout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'calc(var(--spacing) * 5)' }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 'calc(var(--spacing) * 3)'
      }}>
        {title}
      </h2>
      <div style={{
        fontSize: '15px',
        color: 'var(--text-secondary)'
      }}>
        {children}
      </div>
    </div>
  )
}
