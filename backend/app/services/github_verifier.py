import requests
import re
from typing import List, Dict

class GitHubVerifier:
    """Verify projects exist on GitHub"""
    
    GITHUB_API = "https://api.github.com"
    
    @staticmethod
    def extract_projects_from_text(text: str) -> List[str]:
        """Extract potential project names from resume text"""
        # Look for patterns like "Project Name", "github.com/user/repo", URLs, etc.
        patterns = [
            r'(?:github\.com/[\w-]+/([\w-]+))',  # github.com/user/repo
            r'(?:Project[s]?\s*:?\s*)([\w\s-]+?)(?:\n|$)',  # Project: name
            r'(?:Built|Created|Developed)\s+([\w\s-]+)\s+(?:using|with)',  # Built/Created name
        ]
        
        projects = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            projects.extend(matches)
        
        return list(set([p.strip() for p in projects if p.strip()]))
    
    @staticmethod
    def verify_github_repo(username: str, repo_name: str) -> Dict:
        """Check if repository exists on GitHub"""
        try:
            url = f"{GitHubVerifier.GITHUB_API}/repos/{username}/{repo_name}"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "exists": True,
                    "name": data.get("name"),
                    "url": data.get("html_url"),
                    "description": data.get("description"),
                    "stars": data.get("stargazers_count"),
                    "language": data.get("language"),
                    "verified": True
                }
            else:
                return {
                    "exists": False,
                    "verified": False,
                    "error": f"Repository not found (HTTP {response.status_code})"
                }
        except Exception as e:
            return {
                "exists": False,
                "verified": False,
                "error": str(e)
            }
    
    @staticmethod
    def extract_github_links(text: str) -> List[Dict]:
        """Extract GitHub links from text and verify them"""
        github_pattern = r'https?://github\.com/([\w-]+)/([\w-]+)'
        matches = re.findall(github_pattern, text, re.IGNORECASE)
        
        verified_repos = []
        for username, repo in matches:
            verification = GitHubVerifier.verify_github_repo(username, repo)
            verification["username"] = username
            verification["repo_name"] = repo
            verified_repos.append(verification)
        
        return verified_repos
