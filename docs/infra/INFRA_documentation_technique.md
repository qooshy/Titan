\# Documentation Technique INFRA — Ymmo

Projet Bachelor 2 — Ynov Informatique — UF INFRA \& DEV



\---



\## 1. Architecture reseau globale



\### Topologie generale



Ymmo dispose d'un siege social a Aix-en-Provence et de 12 agences reparties sur le territoire national. Chaque agence est connectee au siege via un tunnel VPN/IPSec site a site. L'ensemble forme un reseau prive d'entreprise superpose sur Internet.



```

INTERNET

&#x20;   |

&#x20;   |--- \[Agence 01 - Paris]       LAN: 10.1.1.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 02 - Lyon]        LAN: 10.1.2.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 03 - Marseille]   LAN: 10.1.3.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 04 - Bordeaux]    LAN: 10.1.4.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 05 - Toulouse]    LAN: 10.1.5.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 06 - Nice]        LAN: 10.1.6.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 07 - Nantes]      LAN: 10.1.7.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 08 - Strasbourg]  LAN: 10.1.8.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 09 - Montpellier] LAN: 10.1.9.0/24  -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 10 - Rennes]      LAN: 10.1.10.0/24 -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 11 - Lille]       LAN: 10.1.11.0/24 -- VPN/IPSec --> Siege

&#x20;   |--- \[Agence 12 - Grenoble]    LAN: 10.1.12.0/24 -- VPN/IPSec --> Siege

&#x20;   |

&#x20;   +--- \[SIEGE - Aix-en-Provence]

&#x20;             |

&#x20;             \[Pare-feu / Routeur] 192.168.0.1

&#x20;             |

&#x20;        \[DMZ] 192.168.1.0/24

&#x20;             |--- SRV-WEB   192.168.1.10  (Nginx + App Ymmo)

&#x20;             |--- SRV-DB    192.168.1.11  (PostgreSQL)

&#x20;             |

&#x20;        \[LAN Siege] 192.168.0.0/24

&#x20;             |--- SRV-AD    192.168.0.10  (Windows Server - AD DS, DNS, DHCP)

&#x20;             |--- SRV-FILE  192.168.0.11  (Windows Server - Fichiers, Sauvegardes)

&#x20;             |--- Postes    192.168.0.20 -> 192.168.0.60 (30 postes)

&#x20;             |--- Imprimante 192.168.0.200

```



\---



\## 2. Plan d'adressage IP



\### Siege social — Aix-en-Provence



| Reseau | Plage | Masque | Passerelle | Usage |

|--------|-------|--------|------------|-------|

| LAN Siege | 192.168.0.0/24 | 255.255.255.0 | 192.168.0.1 | Postes, serveurs internes |

| DMZ | 192.168.1.0/24 | 255.255.255.0 | 192.168.1.1 | Serveurs exposes |



| Hote | IP | Role |

|------|-----|------|

| Routeur/Pare-feu | 192.168.0.1 | Passerelle + Firewall |

| SRV-AD-01 | 192.168.0.10 | Active Directory, DNS, DHCP |

| SRV-FILE-01 | 192.168.0.11 | Serveur de fichiers, sauvegardes |

| SRV-WEB-01 | 192.168.1.10 | Hebergement web Ymmo (DMZ) |

| SRV-DB-01 | 192.168.1.11 | Base de donnees PostgreSQL (DMZ) |

| Postes Direction | 192.168.0.20 - 0.25 | 6 postes |

| Postes Commercial | 192.168.0.26 - 0.31 | 6 postes |

| Postes Marketing | 192.168.0.32 - 0.36 | 5 postes |

| Postes RH/Juridique | 192.168.0.37 - 0.41 | 5 postes |

| Postes IT | 192.168.0.42 - 0.49 | 8 postes |

| Imprimante | 192.168.0.200 | Imprimante reseau |

| DHCP Pool | 192.168.0.100 - 0.199 | Attribution dynamique |



\### Agences (modele repete x12)



| Agence | Ville | Reseau LAN | Passerelle | Plage postes | Imprimante |

|--------|-------|------------|------------|--------------|------------|

| AGC-01 | Paris | 10.1.1.0/24 | 10.1.1.1 | 10.1.1.10-14 | 10.1.1.200 |

| AGC-02 | Lyon | 10.1.2.0/24 | 10.1.2.1 | 10.1.2.10-14 | 10.1.2.200 |

| AGC-03 | Marseille | 10.1.3.0/24 | 10.1.3.1 | 10.1.3.10-14 | 10.1.3.200 |

| AGC-04 | Bordeaux | 10.1.4.0/24 | 10.1.4.1 | 10.1.4.10-14 | 10.1.4.200 |

| AGC-05 | Toulouse | 10.1.5.0/24 | 10.1.5.1 | 10.1.5.10-14 | 10.1.5.200 |

| AGC-06 | Nice | 10.1.6.0/24 | 10.1.6.1 | 10.1.6.10-14 | 10.1.6.200 |

| AGC-07 | Nantes | 10.1.7.0/24 | 10.1.7.1 | 10.1.7.10-14 | 10.1.7.200 |

| AGC-08 | Strasbourg | 10.1.8.0/24 | 10.1.8.1 | 10.1.8.10-14 | 10.1.8.200 |

| AGC-09 | Montpellier | 10.1.9.0/24 | 10.1.9.1 | 10.1.9.10-14 | 10.1.9.200 |

| AGC-10 | Rennes | 10.1.10.0/24 | 10.1.10.1 | 10.1.10.10-14 | 10.1.10.200 |

| AGC-11 | Lille | 10.1.11.0/24 | 10.1.11.1 | 10.1.11.10-14 | 10.1.11.200 |

| AGC-12 | Grenoble | 10.1.12.0/24 | 10.1.12.1 | 10.1.12.10-14 | 10.1.12.200 |



Chaque agence dispose d'un routeur local qui etablit le tunnel VPN/IPSec vers le pare-feu du siege. Les postes recoivent leur configuration IP depuis le serveur DHCP du siege via le tunnel.



\---



\## 3. Configuration VPN/IPSec site a site



\### Parametres IKE Phase 1 (ISAKMP)



| Parametre | Valeur |

|-----------|--------|

| Version IKE | IKEv2 |

| Algorithme de chiffrement | AES-256 |

| Algorithme d'integrite | SHA-256 |

| Groupe Diffie-Hellman | Groupe 14 (2048 bits) |

| Duree de vie SA | 86400 secondes (24h) |

| Authentification | Pre-Shared Key (PSK) unique par agence |



\### Parametres IKE Phase 2 (IPSec)



| Parametre | Valeur |

|-----------|--------|

| Protocole | ESP |

| Algorithme de chiffrement | AES-256 |

| Algorithme d'integrite | SHA-256 |

| Mode | Tunnel |

| Duree de vie SA | 3600 secondes (1h) |

| PFS | Groupe 14 |



\### Exemple de configuration routeur agence (syntaxe generique)



```

\# Phase 1

crypto isakmp policy 10

&#x20; encryption aes 256

&#x20; hash sha256

&#x20; authentication pre-share

&#x20; group 14

&#x20; lifetime 86400



crypto isakmp key YMMO\_AGC01\_KEY address 203.0.113.1  # IP publique siege



\# Phase 2

crypto ipsec transform-set YMMO-TS esp-aes 256 esp-sha256-hmac

&#x20; mode tunnel



crypto map YMMO-VPN 10 ipsec-isakmp

&#x20; set peer 203.0.113.1

&#x20; set transform-set YMMO-TS

&#x20; set pfs group14

&#x20; match address VPN-ACL



ip access-list extended VPN-ACL

&#x20; permit ip 10.1.1.0 0.0.0.255 192.168.0.0 0.0.0.255

&#x20; permit ip 10.1.1.0 0.0.0.255 192.168.1.0 0.0.0.255

```



\---



\## 4. Services reseau



\### DNS



Le serveur DNS est hote sur SRV-AD-01 (192.168.0.10) avec Windows Server DNS.



| Zone | Type | Description |

|------|------|-------------|

| ymmo.local | Zone principale | Domaine interne Active Directory |

| 168.192.in-addr.arpa | Zone inverse | Resolution inverse LAN siege |

| 1.10.in-addr.arpa | Zone inverse | Resolution inverse agences |



Enregistrements DNS internes principaux :



```

srvad01.ymmo.local      A    192.168.0.10

srvfile01.ymmo.local    A    192.168.0.11

srvweb01.ymmo.local     A    192.168.1.10

srvdb01.ymmo.local      A    192.168.1.11

```



\### DHCP



Hote sur SRV-AD-01. Configuration par etendue :



| Etendue | Plage | Masque | Passerelle | DNS | Duree bail |

|---------|-------|--------|------------|-----|------------|

| Siege-LAN | 192.168.0.100-199 | /24 | 192.168.0.1 | 192.168.0.10 | 8 jours |

| AGC-01 | 10.1.1.50-99 | /24 | 10.1.1.1 | 192.168.0.10 | 8 jours |

| AGC-02 | 10.1.2.50-99 | /24 | 10.1.2.1 | 192.168.0.10 | 8 jours |

| ... | ... | ... | ... | ... | ... |



Les baux DHCP des agences transitent par le relay DHCP configure sur chaque routeur d'agence (option ip helper-address 192.168.0.10).



\### NAT



Configure sur le routeur/pare-feu du siege :

\- NAT dynamique (PAT) pour l'ensemble du LAN siege vers l'IP publique du siege

\- NAT statique pour SRV-WEB-01 : IP publique port 80/443 -> 192.168.1.10

\- Pas de NAT sur les flux VPN (trafic chiffre exclu du NAT)



\---



\## 5. Active Directory — Windows Server



\### Structure du domaine



```

Domaine : ymmo.local

Niveau fonctionnel : Windows Server 2022

Controleur de domaine principal : SRV-AD-01 (192.168.0.10)

```



\### Arborescence des OU (Unites d'Organisation)



```

ymmo.local

├── OU=Siege

│   ├── OU=Utilisateurs

│   │   ├── OU=Direction

│   │   ├── OU=Commercial

│   │   ├── OU=Marketing

│   │   ├── OU=RH-Juridique

│   │   └── OU=IT-Support

│   ├── OU=Ordinateurs

│   │   ├── OU=Postes-Siege

│   │   └── OU=Serveurs

│   └── OU=Groupes

├── OU=Agences

│   ├── OU=AGC-Paris

│   │   ├── OU=Utilisateurs

│   │   └── OU=Ordinateurs

│   ├── OU=AGC-Lyon

│   ├── OU=AGC-Marseille

│   ├── OU=AGC-Bordeaux

│   ├── OU=AGC-Toulouse

│   ├── OU=AGC-Nice

│   ├── OU=AGC-Nantes

│   ├── OU=AGC-Strasbourg

│   ├── OU=AGC-Montpellier

│   ├── OU=AGC-Rennes

│   ├── OU=AGC-Lille

│   └── OU=AGC-Grenoble

└── OU=ServiceAccounts

```



\### Groupes de securite



| Groupe | Type | Membres | Acces dossier partage |

|--------|------|---------|----------------------|

| GRP-Direction | Securite Global | Utilisateurs Direction | Lecture/Ecriture propre + Lecture autres |

| GRP-Commercial | Securite Global | Utilisateurs Commercial siege + agences | Lecture/Ecriture Commercial uniquement |

| GRP-Marketing | Securite Global | Utilisateurs Marketing | Lecture/Ecriture Marketing uniquement |

| GRP-RH-Juridique | Securite Global | Utilisateurs RH/Juridique | Lecture/Ecriture RH uniquement |

| GRP-IT-Support | Securite Global | Admins IT | Lecture/Ecriture sur tout |

| GRP-Agences | Securite Global | Tous commerciaux agences | Acces dossier Commercial uniquement |



\### Matrice des droits sur dossiers partages



Conforme au document brief client :



| Dossier partage | Direction | Commercial | Marketing | RH-Juridique | IT-Support |

|-----------------|-----------|------------|-----------|--------------|------------|

| Direction | L/E | L | L | L | L |

| Commercial | Interdit | L/E | L | Interdit | Interdit |

| Marketing | Interdit | L | L/E | Interdit | Interdit |

| RH-Juridique | Interdit | L | L | L/E | Interdit |

| IT-Support | Interdit | L | L | Interdit | L/E |



L = Lecture, L/E = Lecture et Ecriture, Interdit = Acces refuse (NTFS Deny)



\---



\## 6. Strategies de groupe (GPO)



\### GPO appliquees au domaine ymmo.local



| GPO | Cible | Description |

|-----|-------|-------------|

| GPO-MotDePasse | ymmo.local (domaine) | Politique de mot de passe : 12 caracteres min, complexite requise, expiration 90 jours, verrouillage apres 5 echecs |

| GPO-Veille | OU=Siege, OU=Agences | Ecran de veille avec mot de passe apres 10 min d'inactivite |

| GPO-Firewall | OU=Ordinateurs | Activation du pare-feu Windows, blocage ports non autorises |

| GPO-Mises-A-Jour | OU=Ordinateurs | Redirection vers WSUS interne pour les mises a jour Windows |

| GPO-Restrictions-Logiciels | OU=Commercial, OU=Agences | Interdiction d'installer des logiciels non autorises (AppLocker) |

| GPO-Mappage-Lecteurs | OU=Siege, OU=Agences | Mappage automatique des lecteurs reseau selon le groupe |

| GPO-Bureau | OU=Agences | Fond d'ecran Ymmo, raccourcis, interdiction de modifier le bureau |

| GPO-Audit | OU=Serveurs | Activation des logs d'audit : connexions, modifications fichiers, acces AD |



\### Detail GPO-MotDePasse



```

Computer Configuration > Windows Settings > Security Settings > Account Policies > Password Policy

&#x20; - Enforce password history : 10 passwords

&#x20; - Maximum password age : 90 days

&#x20; - Minimum password age : 1 day

&#x20; - Minimum password length : 12 characters

&#x20; - Password must meet complexity requirements : Enabled

&#x20; - Store passwords using reversible encryption : Disabled



Account Lockout Policy

&#x20; - Account lockout duration : 30 minutes

&#x20; - Account lockout threshold : 5 invalid logon attempts

&#x20; - Reset account lockout counter after : 30 minutes

```



\### Detail GPO-Mappage-Lecteurs



```

User Configuration > Preferences > Windows Settings > Drive Maps

&#x20; - Lecteur P: \\\\SRV-FILE-01\\Partage-Commun     (Tous)

&#x20; - Lecteur Q: \\\\SRV-FILE-01\\Direction           (GRP-Direction)

&#x20; - Lecteur R: \\\\SRV-FILE-01\\Commercial          (GRP-Commercial)

&#x20; - Lecteur S: \\\\SRV-FILE-01\\Marketing           (GRP-Marketing)

&#x20; - Lecteur T: \\\\SRV-FILE-01\\RH-Juridique        (GRP-RH-Juridique)

&#x20; - Lecteur U: \\\\SRV-FILE-01\\IT-Support          (GRP-IT-Support)

```



\---



\## 7. Configuration des serveurs



\### SRV-AD-01 — Controleur de domaine



\*\*Materiel (VM) :\*\*

\- OS : Windows Server 2022 Standard

\- RAM : 4 Go

\- CPU : 2 vCPU

\- Disque : 60 Go (OS) + 20 Go (SYSVOL/NTDS)

\- Reseau : 1 carte — 192.168.0.10/24



\*\*Roles installes :\*\*

\- AD DS (Active Directory Domain Services)

\- DNS Server

\- DHCP Server

\- WSUS (Windows Server Update Services) — optionnel



\*\*Installation et configuration (PowerShell) :\*\*



```powershell

\# 1. Definir l'IP statique

New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.0.10 -PrefixLength 24 -DefaultGateway 192.168.0.1

Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 127.0.0.1



\# 2. Renommer le serveur

Rename-Computer -NewName "SRV-AD-01" -Restart



\# 3. Installer les roles AD DS et DNS

Install-WindowsFeature -Name AD-Domain-Services, DNS -IncludeManagementTools



\# 4. Promouvoir en controleur de domaine (nouveau foret)

Import-Module ADDSDeployment

Install-ADDSForest `

&#x20; -DomainName "ymmo.local" `

&#x20; -DomainNetbiosName "YMMO" `

&#x20; -ForestMode "WinThreshold" `

&#x20; -DomainMode "WinThreshold" `

&#x20; -InstallDns:$true `

&#x20; -DatabasePath "C:\\Windows\\NTDS" `

&#x20; -LogPath "C:\\Windows\\NTDS" `

&#x20; -SysvolPath "C:\\Windows\\SYSVOL" `

&#x20; -NoRebootOnCompletion:$false `

&#x20; -Force:$true



\# 5. Apres redemarrage — installer DHCP

Install-WindowsFeature -Name DHCP -IncludeManagementTools

Add-DhcpServerInDC -DnsName "srvad01.ymmo.local" -IPAddress 192.168.0.10



\# 6. Configurer l'etendue DHCP siege

Add-DhcpServerv4Scope `

&#x20; -Name "Siege-Aix" `

&#x20; -StartRange 192.168.0.100 `

&#x20; -EndRange 192.168.0.199 `

&#x20; -SubnetMask 255.255.255.0 `

&#x20; -DefaultLeaseTimeSpan 8.00:00:00



Set-DhcpServerv4OptionValue `

&#x20; -ScopeId 192.168.0.0 `

&#x20; -Router 192.168.0.1 `

&#x20; -DnsServer 192.168.0.10 `

&#x20; -DnsDomain "ymmo.local"



\# Exclusions IPs statiques

Add-DhcpServerv4ExclusionRange -ScopeId 192.168.0.0 -StartRange 192.168.0.1 -EndRange 192.168.0.99



\# 7. Creer les OU

$base = "DC=ymmo,DC=local"

New-ADOrganizationalUnit -Name "Siege" -Path $base

New-ADOrganizationalUnit -Name "Utilisateurs" -Path "OU=Siege,$base"

New-ADOrganizationalUnit -Name "Direction" -Path "OU=Utilisateurs,OU=Siege,$base"

New-ADOrganizationalUnit -Name "Commercial" -Path "OU=Utilisateurs,OU=Siege,$base"

New-ADOrganizationalUnit -Name "Marketing" -Path "OU=Utilisateurs,OU=Siege,$base"

New-ADOrganizationalUnit -Name "RH-Juridique" -Path "OU=Utilisateurs,OU=Siege,$base"

New-ADOrganizationalUnit -Name "IT-Support" -Path "OU=Utilisateurs,OU=Siege,$base"

New-ADOrganizationalUnit -Name "Ordinateurs" -Path "OU=Siege,$base"

New-ADOrganizationalUnit -Name "Agences" -Path $base



$villes = @("Paris","Lyon","Marseille","Bordeaux","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Rennes","Lille","Grenoble")

foreach ($ville in $villes) {

&#x20;   New-ADOrganizationalUnit -Name "AGC-$ville" -Path "OU=Agences,$base"

&#x20;   New-ADOrganizationalUnit -Name "Utilisateurs" -Path "OU=AGC-$ville,OU=Agences,$base"

&#x20;   New-ADOrganizationalUnit -Name "Ordinateurs" -Path "OU=AGC-$ville,OU=Agences,$base"

}



\# 8. Creer les groupes

New-ADGroup -Name "GRP-Direction"    -GroupScope Global -GroupCategory Security -Path "OU=Siege,$base"

New-ADGroup -Name "GRP-Commercial"   -GroupScope Global -GroupCategory Security -Path "OU=Siege,$base"

New-ADGroup -Name "GRP-Marketing"    -GroupScope Global -GroupCategory Security -Path "OU=Siege,$base"

New-ADGroup -Name "GRP-RH-Juridique" -GroupScope Global -GroupCategory Security -Path "OU=Siege,$base"

New-ADGroup -Name "GRP-IT-Support"   -GroupScope Global -GroupCategory Security -Path "OU=Siege,$base"

New-ADGroup -Name "GRP-Agences"      -GroupScope Global -GroupCategory Security -Path "OU=Agences,$base"



\# 9. Creer des utilisateurs de demonstration

$mdp = ConvertTo-SecureString "Ymmo@2024!" -AsPlainText -Force



New-ADUser -Name "Sophie Durand" -SamAccountName "s.durand" `

&#x20; -UserPrincipalName "s.durand@ymmo.local" -Path "OU=Direction,OU=Utilisateurs,OU=Siege,$base" `

&#x20; -AccountPassword $mdp -Enabled $true

Add-ADGroupMember -Identity "GRP-Direction" -Members "s.durand"



New-ADUser -Name "Marc Lefebvre" -SamAccountName "m.lefebvre" `

&#x20; -UserPrincipalName "m.lefebvre@ymmo.local" -Path "OU=Commercial,OU=Utilisateurs,OU=Siege,$base" `

&#x20; -AccountPassword $mdp -Enabled $true

Add-ADGroupMember -Identity "GRP-Commercial" -Members "m.lefebvre"



New-ADUser -Name "Admin IT" -SamAccountName "admin.it" `

&#x20; -UserPrincipalName "admin.it@ymmo.local" -Path "OU=IT-Support,OU=Utilisateurs,OU=Siege,$base" `

&#x20; -AccountPassword $mdp -Enabled $true

Add-ADGroupMember -Identity "GRP-IT-Support" -Members "admin.it"

Add-ADGroupMember -Identity "Domain Admins" -Members "admin.it"

```



\---



\### SRV-FILE-01 — Serveur de fichiers



\*\*Materiel (VM) :\*\*

\- OS : Windows Server 2022 Standard

\- RAM : 4 Go

\- CPU : 2 vCPU

\- Disque OS : 60 Go

\- Disque Donnees : 200 Go (partages)

\- Disque Sauvegarde : 500 Go

\- Reseau : 1 carte — 192.168.0.11/24



\*\*Roles installes :\*\*

\- File and Storage Services

\- Windows Server Backup



\*\*Configuration (PowerShell — apres jonction au domaine) :\*\*



```powershell

\# 1. Joindre le domaine (executer avant le reste)

Add-Computer -DomainName "ymmo.local" -Credential (Get-Credential) -Restart



\# 2. Apres redemarrage — installer le role fichiers

Install-WindowsFeature -Name FS-FileServer, Windows-Server-Backup -IncludeManagementTools



\# 3. Initialiser le disque donnees (disque 1)

Initialize-Disk -Number 1 -PartitionStyle GPT

New-Partition -DiskNumber 1 -UseMaximumSize -AssignDriveLetter | Format-Volume -FileSystem NTFS -NewFileSystemLabel "Donnees"

\# Le lecteur sera D:



\# 4. Creer les dossiers partages

$dossiers = @("Direction","Commercial","Marketing","RH-Juridique","IT-Support","Partage-Commun")

foreach ($d in $dossiers) {

&#x20;   New-Item -Path "D:\\Partages\\$d" -ItemType Directory -Force

}



\# 5. Creer les partages SMB

New-SmbShare -Name "Direction"      -Path "D:\\Partages\\Direction"      -FullAccess "YMMO\\GRP-IT-Support" -ReadAccess "YMMO\\GRP-Direction"

New-SmbShare -Name "Commercial"     -Path "D:\\Partages\\Commercial"     -FullAccess "YMMO\\GRP-IT-Support" -ReadAccess "YMMO\\GRP-Commercial"

New-SmbShare -Name "Marketing"      -Path "D:\\Partages\\Marketing"      -FullAccess "YMMO\\GRP-IT-Support" -ReadAccess "YMMO\\GRP-Marketing"

New-SmbShare -Name "RH-Juridique"   -Path "D:\\Partages\\RH-Juridique"   -FullAccess "YMMO\\GRP-IT-Support" -ReadAccess "YMMO\\GRP-RH-Juridique"

New-SmbShare -Name "IT-Support"     -Path "D:\\Partages\\IT-Support"     -FullAccess "YMMO\\GRP-IT-Support"

New-SmbShare -Name "Partage-Commun" -Path "D:\\Partages\\Partage-Commun" -FullAccess "YMMO\\GRP-IT-Support" -ReadAccess "YMMO\\Domain Users"



\# 6. Droits NTFS — exemple Direction (adapter pour chaque dossier)

$acl = Get-Acl "D:\\Partages\\Direction"

$acl.SetAccessRuleProtection($true, $false)  # Desactiver heritage



$regle1 = New-Object System.Security.AccessControl.FileSystemAccessRule("YMMO\\GRP-Direction","Modify","ContainerInherit,ObjectInherit","None","Allow")

$regle2 = New-Object System.Security.AccessControl.FileSystemAccessRule("YMMO\\GRP-IT-Support","FullControl","ContainerInherit,ObjectInherit","None","Allow")

$acl.AddAccessRule($regle1)

$acl.AddAccessRule($regle2)

Set-Acl "D:\\Partages\\Direction" $acl

```



\---



\### SRV-WEB-01 — Serveur web (DMZ)



Pour la maquette de demonstration, ce serveur peut etre represente par le conteneur Docker existant (Nginx + FastAPI). En production ou pour la VM de demo :



\*\*Materiel (VM) :\*\*

\- OS : Ubuntu Server 22.04 LTS (ou Windows Server avec IIS)

\- RAM : 2 Go

\- CPU : 2 vCPU

\- Disque : 40 Go

\- Reseau : 1 carte — 192.168.1.10/24



\*\*Configuration Ubuntu :\*\*



```bash

\# Installer Docker

apt update \&\& apt install -y docker.io docker-compose-plugin



\# Cloner le projet

git clone https://github.com/qooshy/Titan.git /opt/ymmo

cd /opt/ymmo



\# Lancer

docker compose up -d



\# Configurer le service systemd pour demarrage automatique

cat > /etc/systemd/system/ymmo.service << EOF

\[Unit]

Description=Ymmo Platform

After=docker.service

Requires=docker.service



\[Service]

WorkingDirectory=/opt/ymmo

ExecStart=/usr/bin/docker compose up

ExecStop=/usr/bin/docker compose down

Restart=always



\[Install]

WantedBy=multi-user.target

EOF



systemctl enable ymmo

systemctl start ymmo

```



\---



\## 8. Politique de securite reseau



\### Regles pare-feu siege (entrant)



| Regle | Source | Destination | Port | Protocole | Action |

|-------|--------|-------------|------|-----------|--------|

| VPN-Agences | IPs publiques agences | IP publique siege | 500, 4500 | UDP | AUTORISER |

| Web-Public | Tout | SRV-WEB-01 | 80, 443 | TCP | AUTORISER |

| SSH-Admin | IP IT uniquement | SRV-WEB-01 | 22 | TCP | AUTORISER |

| Deny-All | Tout | Tout | Tout | Tout | REFUSER |



\### Regles pare-feu siege (sortant)



| Regle | Source | Destination | Port | Action |

|-------|--------|-------------|------|--------|

| DNS-Out | LAN | Tout | 53 | AUTORISER |

| HTTP-S | LAN | Tout | 80, 443 | AUTORISER |

| VPN | Pare-feu | IPs agences | 500, 4500 | AUTORISER |

| Deny-All | Tout | Tout | Tout | REFUSER |



\### Regles DMZ



| Regle | Source | Destination | Port | Action |

|-------|--------|-------------|------|--------|

| LAN vers DB | SRV-WEB-01 | SRV-DB-01 | 5432 | AUTORISER |

| LAN vers Web | LAN Siege | SRV-WEB-01 | 80, 443 | AUTORISER |

| Deny DMZ vers LAN | DMZ | LAN | Tout | REFUSER |



\### Regles pare-feu agences



| Regle | Source | Destination | Port | Action |

|-------|--------|-------------|------|--------|

| VPN-Siege | Routeur agence | IP publique siege | 500, 4500 | AUTORISER |

| DNS-Siege | Postes agence | 192.168.0.10 | 53 | AUTORISER (via VPN) |

| AD-Auth | Postes agence | 192.168.0.10 | 389, 636, 88 | AUTORISER (via VPN) |

| HTTP-S | Postes agence | Tout | 80, 443 | AUTORISER |

| Deny-All | Tout | Tout | Tout | REFUSER |



\### Mesures complementaires



\- Chiffrement des communications AD : LDAPS (port 636) obligatoire

\- Journalisation centralisee : tous les evenements de securite envoyes vers SRV-AD-01 (Event Viewer centralise)

\- Antivirus : Windows Defender avec definitions mises a jour via WSUS

\- Desactivation des services inutiles sur tous les serveurs (Telnet, FTP, etc.)

\- Politique de mots de passe conforme (voir section GPO)

\- Sauvegarde chiffree (voir section sauvegarde)



\---



\## 9. Plan de sauvegarde et supervision



\### Strategie de sauvegarde 3-2-1



| Copie | Localisation | Support | Frequence |

|-------|-------------|---------|-----------|

| 1re copie | SRV-FILE-01 (disque sauvegarde local) | HDD interne 500 Go | Quotidienne |

| 2e copie | NAS dedie au siege | NAS externe | Hebdomadaire |

| 3e copie hors site | Cloud Azure Blob Storage | Stockage froid | Mensuelle |



\### Planning de sauvegarde



| Tache | Heure | Frequence | Retention | Outil |

|-------|-------|-----------|-----------|-------|

| Sauvegarde AD (SYSVOL + NTDS) | 02h00 | Quotidienne | 30 jours | Windows Server Backup |

| Sauvegarde dossiers partages | 03h00 | Quotidienne | 30 jours | Windows Server Backup |

| Sauvegarde base PostgreSQL | 04h00 | Quotidienne | 30 jours | pg\_dump + script |

| Sauvegarde complete serveurs | 01h00 | Hebdomadaire (dimanche) | 3 mois | Windows Server Backup |

| Archivage cloud | 00h00 | Mensuelle (1er du mois) | 1 an | Script AzCopy |



\### Script sauvegarde PostgreSQL (cron sur SRV-WEB-01)



```bash

\#!/bin/bash

\# /opt/scripts/backup\_db.sh

DATE=$(date +%Y%m%d\_%H%M%S)

BACKUP\_DIR="/mnt/sauvegarde/postgresql"

DB\_NAME="ymmo\_db"

DB\_USER="ymmo"



mkdir -p $BACKUP\_DIR



docker exec titan-db-1 pg\_dump -U $DB\_USER $DB\_NAME | gzip > "$BACKUP\_DIR/ymmo\_db\_$DATE.sql.gz"



\# Supprimer les sauvegardes de plus de 30 jours

find $BACKUP\_DIR -name "\*.sql.gz" -mtime +30 -delete



echo "Sauvegarde $DATE terminee"

```



```bash

\# Ajouter au cron (crontab -e)

0 4 \* \* \* /opt/scripts/backup\_db.sh >> /var/log/backup\_ymmo.log 2>\&1

```



\### Supervision



| Metrique | Seuil alerte | Outil |

|----------|-------------|-------|

| CPU serveurs | > 85% pendant 5 min | Windows Task Manager / Grafana |

| RAM serveurs | > 90% | Idem |

| Espace disque | < 15% libre | Idem |

| Disponibilite VPN | Tunnel down > 2 min | Ping monitoring |

| Disponibilite site web | HTTP 200 absent | Uptime Kuma |

| Connexions AD echouees | > 10 en 5 min | Event Viewer / SIEM |

| Sauvegarde | Echec job | Email alert |



Outil recommande : \*\*Uptime Kuma\*\* (auto-heberge, leger) pour la supervision web et VPN, couplé aux alertes Event Viewer Windows pour l'AD.



\---



\## 10. Proposition solution cloud



\### Solution retenue : Microsoft Azure



\*\*Justification :\*\* coherence avec l'ecosysteme Windows Server / Active Directory. Azure AD Connect permet de synchroniser ymmo.local avec Azure AD pour le SSO. Azure offre egalement des services PaaS directement utilisables pour heberger la plateforme Ymmo en production.



\### Architecture cloud proposee



| Service Azure | Usage | SKU recommande |

|---------------|-------|---------------|

| Azure Virtual Network | Extension du reseau prive vers le cloud (VPN Gateway) | Basic |

| Azure VPN Gateway | Connexion site-a-site avec le siege | VpnGw1 |

| Azure App Service | Hebergement de l'application FastAPI Ymmo | B2 |

| Azure Database for PostgreSQL | Base de donnees managee | Flexible Server B1ms |

| Azure Blob Storage | Sauvegardes mensuelles, assets | LRS Standard |

| Azure AD | Synchronisation AD via Azure AD Connect | Free tier |

| Azure Monitor | Supervision centralisee | Pay-as-you-go |



\### Schema cloud



```

Siege (ymmo.local)

SRV-AD-01 <--> Azure AD Connect <--> Azure AD (ymmo.onmicrosoft.com)

&#x20;                                          |

Routeur siege <--> Azure VPN Gateway <--> Azure VNet (10.100.0.0/16)

&#x20;                                          |--- App Service (FastAPI Ymmo)

&#x20;                                          |--- Azure DB PostgreSQL

&#x20;                                          |--- Blob Storage (sauvegardes)

```



\### Estimation cout mensuel Azure



| Service | Cout estime |

|---------|-------------|

| App Service B2 | \~25 EUR/mois |

| PostgreSQL Flexible B1ms | \~15 EUR/mois |

| VPN Gateway Basic | \~25 EUR/mois |

| Blob Storage (100 Go) | \~2 EUR/mois |

| Azure Monitor | \~5 EUR/mois |

| Total | \~72 EUR/mois |



\---



\## 11. Liste du materiel et budgetisation



\### Siege social — Aix-en-Provence



| Equipement | Quantite | Prix unitaire HT | Total HT |

|-----------|----------|------------------|----------|

| Serveur rack Dell PowerEdge R350 (pour SRV-AD-01 + SRV-FILE-01 en VM) | 1 | 2 800 EUR | 2 800 EUR |

| Serveur rack Dell PowerEdge R250 (pour SRV-WEB-01) | 1 | 1 800 EUR | 1 800 EUR |

| Switch manageable 24 ports PoE (Cisco SG350-28) | 2 | 600 EUR | 1 200 EUR |

| Routeur/Pare-feu (Fortinet FortiGate 60F) | 1 | 900 EUR | 900 EUR |

| NAS sauvegarde (Synology DS923+, 4 baies, 4x4To) | 1 | 1 200 EUR | 1 200 EUR |

| Onduleur (APC Smart-UPS 1500VA) | 2 | 500 EUR | 1 000 EUR |

| Baie rack 12U avec PDU | 1 | 400 EUR | 400 EUR |

| Postes de travail (Dell OptiPlex 3000) | 30 | 650 EUR | 19 500 EUR |

| Imprimante reseau (HP LaserJet Enterprise) | 1 | 600 EUR | 600 EUR |

| Licences Windows Server 2022 Standard (2 serveurs) | 2 | 900 EUR | 1 800 EUR |

| Licences Windows 11 Pro (30 postes) | 30 | 150 EUR | 4 500 EUR |

| Licences Microsoft 365 Business Basic (30 users, 1 an) | 30 | 72 EUR/an | 2 160 EUR |

| \*\*Total Siege\*\* | | | \*\*37 860 EUR HT\*\* |



\### Par agence (modele x12)



| Equipement | Quantite | Prix unitaire HT | Total HT |

|-----------|----------|------------------|----------|

| Routeur VPN (Fortinet FortiGate 40F) | 1 | 400 EUR | 400 EUR |

| Switch 8 ports (Cisco SG110-08) | 1 | 120 EUR | 120 EUR |

| Postes de travail (Dell OptiPlex 3000) | 5 | 650 EUR | 3 250 EUR |

| Imprimante reseau | 1 | 350 EUR | 350 EUR |

| Licences Windows 11 Pro (5 postes) | 5 | 150 EUR | 750 EUR |

| Licences Microsoft 365 Business Basic (5 users, 1 an) | 5 | 72 EUR/an | 360 EUR |

| \*\*Total par agence\*\* | | | \*\*5 230 EUR HT\*\* |



\### Budget total



| Poste | Montant HT |

|-------|-----------|

| Siege | 37 860 EUR |

| 12 agences (12 x 5 230) | 62 760 EUR |

| Mise en oeuvre / installation (prestation) | 8 000 EUR |

| Formation utilisateurs | 2 000 EUR |

| \*\*Total projet\*\* | \*\*110 620 EUR HT\*\* |

| TVA 20% | 22 124 EUR |

| \*\*Total TTC\*\* | \*\*132 744 EUR TTC\*\* |

| Cloud Azure (recurrent, par an) | \~864 EUR/an |



\---



\## 12. Guide de deploiement VM pour la maquette



\### Logiciel de virtualisation



Utiliser \*\*VirtualBox\*\* (gratuit) ou \*\*VMware Workstation\*\*.



\### VMs a creer pour la demonstration



| VM | Nom | OS | RAM | CPU | Disques | Reseau |

|----|-----|-----|-----|-----|---------|--------|

| 1 | SRV-AD-01 | Windows Server 2022 | 4 Go | 2 | 60 Go | Reseau interne "Siege-LAN" |

| 2 | CLIENT-SIEGE | Windows 11 Pro | 2 Go | 2 | 40 Go | Reseau interne "Siege-LAN" |

| 3 | CLIENT-AGENCE | Windows 11 Pro | 2 Go | 2 | 40 Go | Reseau interne "Agence-LAN" |

| 4 | ROUTEUR | pfSense ou VyOS | 512 Mo | 1 | 8 Go | WAN + Siege-LAN + Agence-LAN |



\### Configuration reseau VirtualBox



Creer deux reseaux internes dans VirtualBox :

\- `Siege-LAN` : reseau interne, plage 192.168.0.0/24

\- `Agence-LAN` : reseau interne, plage 10.1.1.0/24



Le ROUTEUR a 3 cartes reseau : NAT (acces Internet), Siege-LAN, Agence-LAN.



\### Etapes de deploiement de la maquette



\*\*Etape 1 — Creer le routeur pfSense\*\*



```

1\. Telecharger pfSense CE (https://www.pfsense.org/download/)

2\. Creer VM VirtualBox : 512 Mo RAM, 8 Go disque, 3 cartes reseau

&#x20;  - Carte 1 : NAT

&#x20;  - Carte 2 : Reseau interne "Siege-LAN"

&#x20;  - Carte 3 : Reseau interne "Agence-LAN"

3\. Installer pfSense, assigner les interfaces :

&#x20;  - WAN = em0 (NAT)

&#x20;  - LAN = em1 (Siege-LAN) -> 192.168.0.1/24

&#x20;  - OPT1 = em2 (Agence-LAN) -> 10.1.1.1/24

4\. Dans pfSense > Firewall > Rules :

&#x20;  - Autoriser tout le trafic LAN <-> OPT1 (simulation VPN)

&#x20;  - Autoriser LAN et OPT1 vers WAN

```



\*\*Etape 2 — Installer SRV-AD-01\*\*



```

1\. Creer VM : 4 Go RAM, 60 Go, reseau "Siege-LAN"

2\. Installer Windows Server 2022 (evaluation 180 jours disponible sur microsoft.com)

3\. Definir IP statique : 192.168.0.10/24, passerelle 192.168.0.1, DNS 127.0.0.1

4\. Executer les commandes PowerShell de la section 7 (SRV-AD-01)

5\. Verifier : Get-ADDomain, Get-DhcpServerv4Scope

```



\*\*Etape 3 — Joindre CLIENT-SIEGE au domaine\*\*



```

1\. Creer VM : 2 Go RAM, 40 Go, reseau "Siege-LAN"

2\. Installer Windows 11 Pro

3\. Definir IP via DHCP (doit recevoir 192.168.0.100+)

4\. Joindre le domaine :

&#x20;  Parametres > Comptes > Acces professionnel > Se connecter a ymmo.local

&#x20;  Ou via PowerShell : Add-Computer -DomainName ymmo.local -Credential ymmo\\admin.it -Restart

5\. Se connecter avec s.durand@ymmo.local (mdp Ymmo@2024!)

6\. Verifier le mappage des lecteurs reseau (apres application GPO)

```



\*\*Etape 4 — Joindre CLIENT-AGENCE au domaine\*\*



```

1\. Creer VM : 2 Go RAM, 40 Go, reseau "Agence-LAN"

2\. Installer Windows 11 Pro

3\. IP : 10.1.1.10/24, passerelle 10.1.1.1, DNS 192.168.0.10

4\. Joindre ymmo.local (le DNS est accessible car pfSense route vers Siege-LAN)

5\. Se connecter avec un compte commercial d'agence

6\. Verifier l'acces aux partages : \\\\SRV-FILE-01\\Commercial

```



\*\*Etape 5 — Verification de la maquette\*\*



```

Depuis CLIENT-SIEGE :

\- ping 192.168.0.10         -> SRV-AD-01 repond

\- ping 10.1.1.10            -> CLIENT-AGENCE repond (routage inter-VLAN via pfSense)

\- nltest /sc\_verify:ymmo.local  -> Secure channel OK

\- gpresult /r               -> GPOs appliquees correctement

\- net use                   -> Lecteurs reseau mappes



Depuis CLIENT-AGENCE :

\- ping 192.168.0.10         -> SRV-AD-01 repond

\- ping 192.168.0.11         -> SRV-FILE-01 repond

\- net use \\\\SRV-FILE-01\\Commercial /user:ymmo\\m.lefebvre  -> Acces OK

```



\---



\## 13. Recapitulatif des livrables INFRA



| Livrable | Statut | Section |

|----------|--------|---------|

| Schema d'architecture reseau | Fourni | Section 1 |

| Plan d'adressage IP | Fourni | Section 2 |

| Configuration VPN/IPSec | Fournie | Section 3 |

| Services DNS, DHCP, NAT | Fournis | Section 4 |

| Active Directory (AD DS) | Fourni | Section 5 |

| GPO | Fournis | Section 6 |

| Guide configuration serveurs | Fourni | Section 7 |

| Politique de securite | Fournie | Section 8 |

| Plan de sauvegarde et supervision | Fourni | Section 9 |

| Proposition solution cloud | Fournie | Section 10 |

| Liste materiel et budget | Fournis | Section 11 |

| Guide deploiement maquette VM | Fourni | Section 12 |

