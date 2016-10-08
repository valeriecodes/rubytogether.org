class Project

  def self.get
    response = JSON.parse RestClient.get("https://api.github.com/repos/rubytogether/projects/projects",
      headers={'Accept': 'application/vnd.github.inertia-preview+json'}
    ).body
  end

end
