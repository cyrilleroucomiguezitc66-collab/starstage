import Layout from '../components/Layout'
import { FileText } from 'lucide-react'

export default function Terms() {
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
            <FileText size={40} color="var(--yellow)" />
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: 'calc(var(--spacing) * 2)'
          }}>
            Conditions Générales d'Utilisation
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
          <Section title="1. Objet">
            <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme StarStage, permettant aux artistes de diffuser des performances musicales en direct et aux utilisateurs de les visionner et d'interagir.</p>
          </Section>

          <Section title="2. Acceptation des conditions">
            <p>En accédant et en utilisant StarStage, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la plateforme.</p>
          </Section>

          <Section title="3. Inscription et compte utilisateur">
            <ul>
              <li>L'inscription est gratuite et nécessite une adresse email valide</li>
              <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
              <li>Un seul compte par personne est autorisé</li>
              <li>Vous devez fournir des informations exactes et les maintenir à jour</li>
            </ul>
          </Section>

          <Section title="4. Services proposés">
            <p><strong>Compte gratuit :</strong></p>
            <ul>
              <li>Visionnage de streams en direct</li>
              <li>Chat en direct</li>
              <li>Création de profil artiste</li>
            </ul>
            <p><strong>Compte Premium :</strong></p>
            <ul>
              <li>Streaming en qualité HD</li>
              <li>Accès aux replays illimités</li>
              <li>Badge premium dans les chats</li>
              <li>Support prioritaire</li>
            </ul>
          </Section>

          <Section title="5. Crédits virtuels">
            <ul>
              <li>Les crédits sont des devises virtuelles utilisées pour offrir des cadeaux aux artistes</li>
              <li>Les crédits ne peuvent être ni remboursés ni échangés contre de l'argent réel</li>
              <li>Les artistes reçoivent 70% de la valeur des cadeaux envoyés</li>
              <li>La plateforme conserve 30% pour les frais de service</li>
              <li>Les paiements aux artistes sont effectués mensuellement</li>
            </ul>
          </Section>

          <Section title="6. Règles de conduite">
            <p>Il est strictement interdit de :</p>
            <ul>
              <li>Publier du contenu illégal, offensant ou discriminatoire</li>
              <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
              <li>Usurper l'identité d'autrui</li>
              <li>Diffuser du spam ou des contenus promotionnels non sollicités</li>
              <li>Utiliser des robots ou automatiser l'utilisation de la plateforme</li>
              <li>Contourner les mesures de sécurité</li>
              <li>Violer les droits de propriété intellectuelle</li>
            </ul>
          </Section>

          <Section title="7. Contenu des utilisateurs">
            <ul>
              <li>Vous conservez vos droits sur le contenu que vous publiez</li>
              <li>Vous accordez à StarStage une licence mondiale pour héberger, distribuer et afficher votre contenu</li>
              <li>Vous garantissez détenir tous les droits sur le contenu publié</li>
              <li>StarStage se réserve le droit de modérer et supprimer tout contenu inapproprié</li>
            </ul>
          </Section>

          <Section title="8. Propriété intellectuelle">
            <p>La plateforme StarStage, son design, ses fonctionnalités et son contenu sont protégés par le droit d'auteur et autres droits de propriété intellectuelle. Toute reproduction non autorisée est interdite.</p>
          </Section>

          <Section title="9. Résiliation">
            <ul>
              <li>Vous pouvez supprimer votre compte à tout moment depuis les paramètres</li>
              <li>StarStage peut suspendre ou supprimer votre compte en cas de violation des CGU</li>
              <li>En cas de résiliation, vos crédits non utilisés sont perdus</li>
            </ul>
          </Section>

          <Section title="10. Limitation de responsabilité">
            <ul>
              <li>StarStage est fourni "tel quel" sans garantie d'aucune sorte</li>
              <li>Nous ne garantissons pas l'absence d'interruptions ou d'erreurs</li>
              <li>Nous ne sommes pas responsables du contenu publié par les utilisateurs</li>
              <li>Notre responsabilité est limitée au montant payé au cours des 12 derniers mois</li>
            </ul>
          </Section>

          <Section title="11. Protection des mineurs">
            <p>La plateforme est strictement réservée aux personnes majeures. Les parents sont responsables de surveiller l'accès de leurs enfants à Internet.</p>
          </Section>

          <Section title="12. Modifications des CGU">
            <p>StarStage se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des changements importants par email.</p>
          </Section>

          <Section title="13. Droit applicable et juridiction">
            <p>Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.</p>
          </Section>

          <Section title="14. Contact">
            <p>Pour toute question concernant ces conditions :<br />
            Email : legal@starstage.com<br />
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
