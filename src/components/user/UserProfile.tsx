
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, UserIcon } from "lucide-react";

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const UserProfile = () => {
  const { user, userName, updateUserName } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: userName || "",
    email: user?.email || "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        name: userName || "",
        email: user.email || ""
      }));
      getProfileAvatar();
    }
  }, [user, userName]);

  const getProfileAvatar = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data?.avatar_url) {
        const { data: fileData } = await supabase.storage
          .from('avatars')
          .download(data.avatar_url);
          
        if (fileData) {
          const url = URL.createObjectURL(fileData);
          setAvatarUrl(url);
        }
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Update profile name through our context function
      const { error: nameError } = await updateUserName(profileData.name);
      if (nameError) throw nameError;

      // If password fields are filled, update password
      if (profileData.password && profileData.password === profileData.confirmPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: profileData.password
        });

        if (passwordError) throw passwordError;
      } else if (profileData.password) {
        throw new Error("Passwords do not match");
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      // Reset password fields
      setProfileData({
        ...profileData,
        password: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}-${Math.random()}.${fileExt}`;
    
    setUploadingAvatar(true);
    
    try {
      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Update the user's profile with the new avatar path
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Show success message
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });
      
      // Update avatar display
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar.",
        variant: "destructive"
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your profile information here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={profileData.name} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      <UserIcon className="h-12 w-12" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex items-center gap-4">
                  <Label 
                    htmlFor="avatar-upload" 
                    className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
                  >
                    {uploadingAvatar ? "Uploading..." : "Change Picture"}
                  </Label>
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProfileUpdate} 
                disabled={loading}
                className="ml-auto"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Change your password here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={profileData.password}
                  onChange={handleInputChange}
                  placeholder="New password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProfileUpdate} 
                disabled={loading || !profileData.password || profileData.password !== profileData.confirmPassword}
                className="ml-auto"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
