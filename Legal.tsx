import Layout from '../components/Layout'
import { Scale } from 'lucide-react'

export default function Legal() {
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
            <Scale size={40} color="var(--yellow)" />
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 2)'
          }}>
            Mentions Légales
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)'
          }}>
            Informations légales obligatoires
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
          <Section title="1. Éditeur du site">
            <p><strong>Raison sociale :</strong> JLBELE CONSULTING<br />
            <strong>SIREN :</strong> 888 702 834<br />
            <strong>SIRET :</strong> 888 702 834 00019<br />
            <strong>TVA intracommunautaire :</strong> FR67 888702834<br />
            <strong>Directeur de publication :</strong> Jean-Luc Bele<br />
            <strong>Email :</strong> contact@starstage.com<br />
            <strong>Téléphone :</strong> +33 1 42 00 00 00</p>
          </Section>

          <Section title="2. Hébergement">
            <p><strong>Hébergeur :</strong> Supabase Inc.<br />
            <strong>Adresse :</strong> 970 Toa Payoh North, #07-04, Singapore 318992<br />
            <strong>Infrastructure :</strong> AWS (Amazon Web Services)<br />
            <strong>Localisation des serveurs :</strong> Union Européenne</p>
          </Section>

          <Section title="3. Traitement des paiements">
            <p><strong>Prestataire :</strong> Stripe Payments Europe, Ltd.<br />
            <strong>Adresse :</strong> 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Ireland<br />
            <strong>Agrément :</strong> Établissement de paiement agréé par la Central Bank of Ireland</p>
          </Section>

          <Section title="4. Propriété intellectuelle">
            <p>L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, sons, logiciels) est la propriété exclusive de StarStage ou de ses partenaires.</p>
            <p>Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de StarStage.</p>
            <p>Les marques et logos figurant sur le site sont des marques déposées. Toute reproduction non autorisée constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.</p>
          </Section>

          <Section title="5. Protection des données personnelles">
            <p><strong>Responsable du traitement :</strong> StarStage<br />
            <strong>Délégué à la protection des données (DPO) :</strong> dpo@starstage.com</p>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant.</p>
            <p>Pour exercer vos droits : privacy@starstage.com</p>
            <p>Vous pouvez également introduire une réclamation auprès de la CNIL :<br />
            Commission Nationale de l'Informatique et des Libertés<br />
            3 Place de Fontenoy - TSA 80715<br />
            75334 PARIS CEDEX 07<br />
            Téléphone : 01 53 73 22 22<br />
            Site web : www.cnil.fr</p>
          </Section>

          <Section title="6. Cookies">
            <p>Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. Vous pouvez gérer vos préférences de cookies dans les paramètres.</p>
            <p>Conformément à l'article 82 de la loi Informatique et Libertés et à la directive ePrivacy, nous recueillons votre consentement avant le dépôt de cookies non essentiels.</p>
          </Section>

          <Section title="7. Limitation de responsabilité">
            <p>StarStage s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, StarStage ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.</p>
            <p>StarStage ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de sites liés à celui-ci.</p>
            <p>StarStage décline toute responsabilité concernant :</p>
            <ul>
              <li>Les interruptions ou dysfonctionnements du service</li>
              <li>Les virus ou programmes malveillants</li>
              <li>Le contenu publié par les utilisateurs</li>
              <li>Les sites tiers vers lesquels pointent des liens</li>
            </ul>
          </Section>

          <Section title="8. Droit applicable">
            <p>Le présent site et les présentes mentions légales sont régis par le droit français. Tout litige relatif à l'utilisation du site est soumis aux tribunaux compétents de Paris.</p>
          </Section>

          <Section title="9. Signalement de contenus illicites">
            <p>Conformément à la loi pour la confiance dans l'économie numérique (LCEN), vous pouvez signaler tout contenu illicite à l'adresse : abuse@starstage.com</p>
            <p>Le signalement doit contenir :</p>
            <ul>
              <li>La date et l'heure du signalement</li>
              <li>L'identité du notifiant (nom, prénom, adresse email)</li>
              <li>La description du contenu litigieux et sa localisation précise</li>
              <li>Les motifs pour lesquels le contenu doit être retiré</li>
            </ul>
          </Section>

          <Section title="10. Médiation">
            <p>Conformément à l'article L.616-1 du Code de la consommation, nous proposons un dispositif de médiation de la consommation.</p>
            <p><strong>Médiateur :</strong> Centre de Médiation et d'Arbitrage de Paris (CMAP)<br />
            <strong>Adresse :</strong> 39 Avenue Franklin D. Roosevelt, 75008 Paris<br />
            <strong>Site web :</strong> https://www.cmap.fr</p>
            <p>En cas de litige, vous pouvez également utiliser la plateforme de règlement en ligne des litiges de la Commission Européenne : https://ec.europa.eu/consumers/odr/</p>
          </Section>

          <Section title="11. Crédits">
            <p><strong>Conception et développement :</strong> StarStage<br />
            <strong>Icônes :</strong> Lucide Icons<br />
            <strong>Hébergement web :</strong> Supabase / AWS</p>
          </Section>

          <Section title="12. Contact">
            <p>Pour toute question concernant les mentions légales :<br />
            <strong>Email :</strong> legal@starstage.com<br />
            <strong>Entreprise :</strong> JLBELE CONSULTING<br />
            <strong>Téléphone :</strong> +33 1 42 00 00 00</p>
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
