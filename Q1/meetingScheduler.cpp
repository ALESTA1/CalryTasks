#include<bits/stdc++.h>
using namespace std;

vector<vector<int>> schedule(vector<vector<int>> &v){
    vector<vector<int>> ans;


    sort(v.begin(), v.end());

    int l = v[0][0];
    int r = v[0][1];

    for(int i = 1; i < v.size(); i++){

        if(v[i][0] <= r){
            r = max(r, v[i][1]);
        }
        else{

            ans.push_back({l, r});
            l = v[i][0];
            r = v[i][1];
        }
    }

    ans.push_back({l, r});

    return ans;
}

int main(){
    cout << "Enter number of segments: " << endl;
    int segments;
    cin >> segments;
    if(segments==0){
        cout<<"No meetings scheduled"<<endl;
        return 0;
    }
    vector<vector<int>> v;

    cout << "Enter the segments:" << endl;
    for(int i = 0; i < segments; i++){
        int x, y;
        cin >> x >> y;
        v.push_back({x, y});
    }


    vector<vector<int>> ans = schedule(v);


    cout << "Optimized Schedule" << endl;
    for(auto &interval : ans){
        cout<< interval[0] << " " << interval[1]<< endl;
    }

    return 0;
}
