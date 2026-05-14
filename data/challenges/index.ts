import { ChallengeRepository } from "@/domain/challenge";

import { webVulnerabilityChallenges } from "./web-vulnerabilities";
import { authenticationChallenges } from "./authentication";
import { authorizationChallenges } from "./authorization";
import { cryptographyChallenges } from "./cryptography";
import { privacyChallenges } from "./privacy-gdpr";
import { securityBasicsChallenges } from "./security-basics";
import { threatModelingChallenges } from "./threat-modeling";
import { riskManagementChallenges } from "./risk-management";
import { secureDevelopmentChallenges } from "./secure-development";
import { microservicesSupplyChainChallenges } from "./microservices-supply-chain";
import { aiSecurityChallenges } from "./ai-security";

export const allChallenges = [
  ...webVulnerabilityChallenges,
  ...authenticationChallenges,
  ...authorizationChallenges,
  ...cryptographyChallenges,
  ...privacyChallenges,
  ...securityBasicsChallenges,
  ...threatModelingChallenges,
  ...riskManagementChallenges,
  ...secureDevelopmentChallenges,
  ...microservicesSupplyChainChallenges,
  ...aiSecurityChallenges,
];

export const challengeRepository = new ChallengeRepository(allChallenges);
