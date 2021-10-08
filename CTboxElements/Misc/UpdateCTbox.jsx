//****************************************//
//   Update CTbox File v1.0
//****************************************//

/**
 * Overwrites the current CTbox Files with the ones found in the Software Ressources Folder.
 */
function updateCTbox(){
    var scriptFolder = new Folder( "//peps/studioPEP/TEAM SHARE/Sylvain LORENT/ScriptsAE" );
    var scriptFiles = scriptFolder.getFiles( "CTbox*" );
    var targetFolder = new Folder( Folder.userData.fsName + "/Adobe/After Effects/18.4/Scripts/ScriptUI Panels" );
    targetFolder.create();
    for( var i = 0 ; i < scriptFiles.length ; i++ ){ copyFiles( scriptFiles[i] , targetFolder ); }
}
function copyFiles( item , destination ){
    if( item instanceof Folder ){
        var newFolder = new Folder( destination.fsName + "/" + item.name )
        newFolder.create()
        var folderFiles = item.getFiles();
        for( var i = 0 ; i < folderFiles.length ; i++ ){
            copyFiles( folderFiles[i] , newFolder );
        }
    } else {
        item.copy( destination.fsName + "\\" + item.name );
    }
}